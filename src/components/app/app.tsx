// src/components/app/app.tsx
import { CSSProperties, useState } from 'react';
import clsx from 'clsx';

import { Article } from '../article/Article';
import { ArticleParamsForm } from '../article-params-form/ArticleParamsForm';
import { defaultArticleState, ArticleStateType } from './../../constants/articleProps';

import styles from './app.module.scss';

export const App = () => {
	// Состояние для примененных настроек статьи
	const [articleState, setArticleState] = useState<ArticleStateType>(defaultArticleState);

	// Функция для применения новых настроек
	const applySettings = (newState: ArticleStateType) => {
		setArticleState(newState);
	};

	// Функция для сброса к дефолтным настройкам
	const resetSettings = () => {
		setArticleState(defaultArticleState);
	};

	return (
		<main
			className={clsx(styles.main)}
			style={
				{
					'--font-family': articleState.fontFamilyOption.value,
					'--font-size': articleState.fontSizeOption.value,
					'--font-color': articleState.fontColor.value,
					'--container-width': articleState.contentWidth.value,
					'--bg-color': articleState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm 
				currentState={articleState}
				onApply={applySettings}
				onReset={resetSettings}
			/>
			<Article />
		</main>
	);
};