import requests
from bs4 import BeautifulSoup
import json
import re
from datetime import datetime

def crawl_competition_details(link):
    base_url = 'https://www.wevity.com'
    full_url = base_url + link
    webpage = requests.get(full_url)
    soup = BeautifulSoup(webpage.content, "html.parser")

    # 이미지 URL 처리
    img_tag = soup.select_one('.cd-area .img img')
    img_url = img_tag['src'] if img_tag else 'N/A'

    # 상대 경로일 경우 절대 경로로 변환
    if img_url != 'N/A' and not img_url.startswith('http'):
        img_url = base_url + img_url

    # 응모 자격 정보
    target_tag = soup.select_one('.cd-info-list li span.tit:-soup-contains("응모대상")')
    target = target_tag.find_parent('li').get_text(strip=True).replace("응모대상", "").strip() if target_tag else 'N/A'
    target_list = [t.strip() for t in target.split(',')] if target != 'N/A' else []

    # 공모 기간 정보
    deadline_tag = soup.select_one('.dday-area')
    start_date, end_date = 'N/A', 'N/A'  # 기본 값

    if deadline_tag:
        deadline_text = deadline_tag.get_text(strip=True)
        deadline = deadline_text.replace("접수기간", "").strip()
        deadline = re.sub(r'\s*D[-+]\d+', '', deadline)  # D-날짜 제거
        deadline = ' '.join(deadline.split())  # 공백 정리

        # 시작일과 종료일로 나누기 (예: '2024-11-26 ~ 2024-12-09')
        date_range = deadline.split("~")
        if len(date_range) == 2:
            start_date_str = date_range[0].strip()
            end_date_str = date_range[1].strip()

            # 날짜 형식을 ISO 8601 형식으로 변환
            try:
                start_date = datetime.strptime(start_date_str, '%Y-%m-%d').isoformat() + '.000+00:00'
                end_date = datetime.strptime(end_date_str, '%Y-%m-%d').isoformat() + '.000+00:00'
            except ValueError:
                start_date, end_date = 'N/A', 'N/A'

    # 수상내역 정보
    prize_tag = soup.select_one('.cd-info-list li span.tit:-soup-contains("1등 상금")')
    prize = prize_tag.find_parent('li').get_text(strip=True).replace("1등 상금", "").strip() if prize_tag else 'N/A'

    # 홈페이지 링크
    homepage_tag = soup.select_one('.cd-info-list li span.tit:-soup-contains("홈페이지")')
    homepage = homepage_tag.find_next('a')['href'] if homepage_tag and homepage_tag.find_next('a') else 'N/A'

    # 상세 내용 (공모전 상세설명)
    description_tag = soup.select_one('.comm-desc')
    description = description_tag.get_text(strip=True) if description_tag else 'N/A'

    return {
        'img_url': img_url,
        'target': target_list,
        'start_date': start_date,
        'end_date': end_date,
        'prize': prize,
        'homepage': homepage,
        'description': description
    }

def crawling_tg(start_url, page_count):
    competitions_list = []  # 공모전 데이터를 저장할 리스트

    for page in range(1, page_count + 1):
        url = start_url + str(page)
        print(f"크롤링 중: {url}")

        webpage = requests.get(url)
        soup = BeautifulSoup(webpage.content, "html.parser")
        competitions = soup.find_all('li')

        for comp in competitions:
            title_tag = comp.select_one('.tit a')
            if title_tag:
                title = title_tag.get_text(strip=True)
                link = title_tag['href']

                # 'SPECIAL', 'SPECIALIDEA', 'IDEA' 문자열을 title에서 제거
                title = title.replace('SPECIAL', '').replace('SPECIALIDEA', '').replace('IDEA', '').strip()

                # 공모전 분야
                category_tag = comp.select_one('.sub-tit')
                if category_tag:
                    # '분야 :' 제거 및 리스트 변환
                    category = category_tag.get_text(strip=True).replace("분야 :", "").strip()
                    category = [item.strip() for item in category.split(",")]
                else:
                    category = []

                # 주최사 정보
                organizer_tag = comp.select_one('.organ')
                organizer = organizer_tag.get_text(strip=True) if organizer_tag else 'N/A'

                # 조회수 정보
                views_tag = comp.select_one('.read')
                views = int(views_tag.get_text(strip=True).replace(",", "")) if views_tag else 0  # 정수형으로 변환

                # 공모전 상세정보 크롤링
                details = crawl_competition_details(link)

                # 공모전 데이터
                competition_info = {
                    'title': title,
                    'category': category,
                    'organizer': organizer,
                    'views': views,
                    **details
                }
                competitions_list.append(competition_info)

    # JSON 파일로 저장 (link는 제외)
    with open('competitions.json', 'w', encoding='utf-8') as json_file:
        json.dump(competitions_list, json_file, ensure_ascii=False, indent=4)

    print("크롤링 완료! JSON 파일 저장됨.")

# 크롤링 실행
base_url = 'https://www.wevity.com/?c=find&s=1&gub=1&gp='
page_count = 10
crawling_tg(base_url, page_count)
