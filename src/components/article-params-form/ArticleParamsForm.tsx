// src/components/article-params-form/ArticleParamsForm.tsx
import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';

import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	currentState: ArticleStateType;
	onApply: (state: ArticleStateType) => void;
	onReset: () => void;
};

export const ArticleParamsForm = ({ 
	currentState, 
	onApply, 
	onReset 
}: ArticleParamsFormProps) => {
	// Состояние открытия сайдбара
	const [isOpen, setIsOpen] = useState<boolean>(false);
	
	// Локальное состояние формы (изменяется до применения)
	const [formState, setFormState] = useState<ArticleStateType>(currentState);
	
	// Ссылка на сайдбар для определения кликов вне него
	const sidebarRef = useRef<HTMLDivElement>(null);

	// Обновляем локальное состояние при изменении currentState (например, после сброса)
	useEffect(() => {
		setFormState(currentState);
	}, [currentState]);

	// Обработчик клика вне сайдбара
	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				isOpen && 
				sidebarRef.current && 
				!sidebarRef.current.contains(event.target as Node) &&
				!(event.target as Element).closest('.arrow-button-container')
			) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleOutsideClick);
		}

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	// Обработчик применения настроек
	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(formState);
		setIsOpen(false);
	};

	// Обработчик сброса настроек
	const handleReset = () => {
		onReset();
		setFormState(defaultArticleState);
		setIsOpen(false);
	};

	// Обработчик изменения значения в форме
	const handleChange = <K extends keyof ArticleStateType>(
		key: K,
		value: ArticleStateType[K]
	) => {
		setFormState((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	return (
		<>
			<div className="arrow-button-container">
				<ArrowButton 
					isOpen={isOpen} 
					onClick={() => setIsOpen(!isOpen)} 
				/>
			</div>
			
			{/* Оверлей */}
			{isOpen && (
				<div 
					className={styles.overlay}
					onClick={() => setIsOpen(false)}
				/>
			)}
			
			<aside 
				ref={sidebarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}
			>
				<form className={styles.form} onSubmit={handleApply}>
					<div className={styles.formContent}>
						<Select
							title="Шрифт"
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={(option) => handleChange('fontFamilyOption', option)}
						/>
						
						<Separator />
						
						<RadioGroup
							name="fontSize"
							title="Размер шрифта"
							selected={formState.fontSizeOption}
							options={fontSizeOptions}
							onChange={(option) => handleChange('fontSizeOption', option)}
						/>
						
						<Separator />
						
						<Select
							title="Цвет шрифта"
							selected={formState.fontColor}
							options={fontColors}
							onChange={(option) => handleChange('fontColor', option)}
						/>
						
						<Separator />
						
						<Select
							title="Цвет фона"
							selected={formState.backgroundColor}
							options={backgroundColors}
							onChange={(option) => handleChange('backgroundColor', option)}
						/>
						
						<Separator />
						
						<Select
							title="Ширина контента"
							selected={formState.contentWidth}
							options={contentWidthArr}
							onChange={(option) => handleChange('contentWidth', option)}
						/>
					</div>
					
					<div className={styles.bottomContainer}>
						<Button 
							title="Сбросить" 
							htmlType="reset" 
							type="clear" 
							onClick={handleReset}
						/>
						<Button 
							title="Применить" 
							htmlType="submit" 
							type="apply" 
						/>
					</div>
				</form>
			</aside>
		</>
	);
};