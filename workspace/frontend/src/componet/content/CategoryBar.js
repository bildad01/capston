import React, { useState } from 'react';
import styles from './CategoryBar.module.css';

export default function CategoryBar({ categories, selectedCategory, setSelectedCategory, targets, selectedTarget, setSelectedTarget }) {
  const [isCategoryVisible, setIsCategoryVisible] = useState(true); // 카테고리 보이기 상태 관리
  const [isTargetVisible, setIsTargetVisible] = useState(true); // 연령별 보이기 상태 관리

  return (
    <aside className={styles.categorySelection}>
      {/* 분야별 */}
      <h3 
        className={styles.categoryHeading} 
        onClick={() => setIsCategoryVisible(!isCategoryVisible)} // 헤딩 전체에 클릭 이벤트 적용
      >
        분야별
        <button
          className={styles.toggleButton} // 토글 버튼 스타일
        >
          {isCategoryVisible ? '➖' : '➕'} {/* 상태에 따라 버튼 텍스트 변경 */}
        </button>
      </h3>

      {isCategoryVisible && ( /* isCategoryVisible이 true일 때만 카테고리 목록 표시 */
        <ul className={styles.categoryList}>
          <li className={styles.categoryListItem}>
            <button
              onClick={() => setSelectedCategory('All')}
              className={`${styles.categoryButton} ${selectedCategory === 'All' ? styles.selectedCategoryButton : styles.defaultCategoryButton}`}
            >
              전체
            </button>
          </li>
          {categories.map((category, index) => (
            <li key={index} className={styles.categoryListItem}>
              <button
                onClick={() => setSelectedCategory(category)}
                className={`${styles.categoryButton} ${selectedCategory === category ? styles.selectedCategoryButton : styles.defaultCategoryButton}`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 응시 대상자 */}
      <h3 
        className={styles.categoryHeading} 
        onClick={() => setIsTargetVisible(!isTargetVisible)} // 헤딩 전체에 클릭 이벤트 적용
      >
        응시 대상자
        <button
          className={styles.toggleButton} // 토글 버튼 스타일
        >
          {isTargetVisible ? '➖' : '➕'} {/* 상태에 따라 버튼 텍스트 변경 */}
        </button>
      </h3>

      {isTargetVisible && ( /* isTargetVisible이 true일 때만 연령별 추천 목록 표시 */
        <ul className={styles.categoryList}>
          <li className={styles.categoryListItem}>
            <button
              onClick={() => setSelectedTarget('All')}
              className={`${styles.categoryButton} ${selectedTarget === 'All' ? styles.selectedCategoryButton : styles.defaultCategoryButton}`}
            >
              전체
            </button>
          </li>
          {targets.map((target, index) => (
            <li key={index} className={styles.categoryListItem}>
              <button
                onClick={() => setSelectedTarget(target)}
                className={`${styles.categoryButton} ${selectedTarget === target ? styles.selectedCategoryButton : styles.defaultCategoryButton}`}
              >
                {target}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
