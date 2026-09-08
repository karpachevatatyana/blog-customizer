import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

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
	onReset,
}: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [formState, setFormState] = useState<ArticleStateType>(currentState);
	const sidebarRef = useRef<HTMLElement>(null);

	useEffect(() => {
		setFormState(currentState);
	}, [currentState]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handleOutsideClick = (event: MouseEvent) => {
			if (
				sidebarRef.current &&
				!sidebarRef.current.contains(event.target as Node) &&
				!(event.target as Element).closest('.arrow-button-container')
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleOutsideClick);

		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		};
	}, [isOpen]);

	const handleApply = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(formState);
		setIsOpen(false);
	};

	const handleReset = () => {
		onReset();
		setFormState(defaultArticleState);
		setIsOpen(false);
	};

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
				<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
			</div>

			<aside
				ref={sidebarRef}
				className={clsx(styles.container, {
					[styles.container_open]: isOpen,
				})}>
				<form className={styles.form} onSubmit={handleApply}>
					{/* Заголовок - размер 31, uppercase, отступ снизу 50px */}
					<div className={styles.title}>
						<Text size={31} weight={800} uppercase align="left">
							Задайте параметры
						</Text>
					</div>

					<div className={styles.formContent}>
						<Select
							title="Шрифт"
							selected={formState.fontFamilyOption}
							options={fontFamilyOptions}
							onChange={(option) => handleChange('fontFamilyOption', option)}
						/>

						<RadioGroup
							name="fontSize"
							title="Размер шрифта"
							selected={formState.fontSizeOption}
							options={fontSizeOptions}
							onChange={(option) => handleChange('fontSizeOption', option)}
						/>

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
						<Button title="Применить" htmlType="submit" type="apply" />
					</div>
				</form>
			</aside>
		</>
	);
};