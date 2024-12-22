import requests
from bs4 import BeautifulSoup
import json
import re

def crawl_competition_details(link):
    base_url = 'https://www.wevity.com'
    full_url = base_url + link
    webpage = requests.get(full_url)
    soup = BeautifulSoup(webpage.content, "html.parser")

    img_tag = soup.select_one('.cd-area .img img')
    img_url = img_tag['src'] if img_tag else 'N/A'

    target_tag = soup.select_one('.cd-info-list li span.tit:contains("응모대상")')
    target = target_tag.find_parent('li').get_text(strip=True).replace("응모대상", "").strip() if target_tag else 'N/A'

    deadline_tag = soup.select_one('.dday-area')
    if deadline_tag:
        deadline_text = deadline_tag.get_text(strip=True)
        deadline = deadline_text.replace("접수기간", "").strip()
        deadline = re.sub(r'\s*D[-+]\d+', '', deadline)
        deadline = ' '.join(deadline.split())
    else:
        deadline = 'N/A'

    prize_tag = soup.select_one('.cd-info-list li span.tit:contains("1등 상금")')
    prize = prize_tag.find_parent('li').get_text(strip=True).replace("1등 상금", "").strip() if prize_tag else 'N/A'

    homepage_tag = soup.select_one('.cd-info-list li span.tit:contains("홈페이지")')
    homepage = homepage_tag.find_next('a')['href'] if homepage_tag and homepage_tag.find_next('a') else 'N/A'

    return {
        'img_url': img_url,
        'target': target,
        'deadline': deadline,
        'prize': prize,
        'homepage': homepage
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

                category_tag = comp.select_one('.sub-tit')
                category = category_tag.get_text(strip=True) if category_tag else 'N/A'

                organizer_tag = comp.select_one('.organ')
                organizer = organizer_tag.get_text(strip=True) if organizer_tag else 'N/A'

                views_tag = comp.select_one('.read')
                views = views_tag.get_text(strip=True) if views_tag else 'N/A'

                details = crawl_competition_details(link)

                competition_info = {
                    'title': title,
                    'category': category,
                    'organizer': organizer,
                    'views': views,
                    'link': link,
                    **details
                }
                competitions_list.append(competition_info)

    # JSON 파일로 저장
    with open('competitions.json', 'w', encoding='utf-8') as json_file:
        json.dump(competitions_list, json_file, ensure_ascii=False, indent=4)

    print("크롤링 완료! JSON 파일 저장됨.")

# 크롤링 실행
base_url = 'https://www.wevity.com/?c=find&s=1&gub=1&gp='
page_count = 10
crawling_tg(base_url, page_count)
