import { type ComponentPropsWithoutRef, type ElementType } from 'react';
import { cn } from '../../lib/utils';

type TitleLevel = 1 | 2 | 3 | 4 | 5;
type TextSize = 'xs' | 'sm' | 'base' | 'lg';
type TypographyColor = 'default' | 'muted' | 'primary' | 'hero-heading' | 'hero-muted';
type TypographyFont = 'sans' | 'roboto';

const titleTags: Record<TitleLevel, ElementType> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
};

const titleStyles: Record<TitleLevel, string> = {
  1: 'text-4xl leading-tight font-bold tracking-tight nav:text-5xl lg:text-[3.25rem] lg:leading-[1.15]',
  2: 'text-3xl leading-tight font-bold tracking-tight nav:text-4xl',
  3: 'text-2xl leading-snug font-semibold nav:text-3xl',
  4: 'text-xl leading-snug font-semibold',
  5: 'text-lg leading-snug font-semibold',
};

const textSizes: Record<TextSize, string> = {
  xs: 'text-xs leading-5',
  sm: 'text-sm leading-6',
  base: 'text-base leading-7',
  lg: 'text-lg leading-8',
};

const colorStyles: Record<TypographyColor, string> = {
  default: 'text-foreground',
  muted: 'text-muted',
  primary: 'text-primary',
  'hero-heading': 'text-hero-heading',
  'hero-muted': 'text-hero-muted',
};

const fontStyles: Record<TypographyFont, string> = {
  sans: 'font-sans',
  roboto: 'font-roboto',
};

type TitleProps = ComponentPropsWithoutRef<'h1'> & {
  level?: TitleLevel;
  color?: TypographyColor;
  font?: TypographyFont;
};

function Title({
  level = 1,
  color = 'default',
  font = 'sans',
  className,
  children,
  ...props
}: TitleProps) {
  const Tag = titleTags[level];

  return (
    <Tag
      className={cn(titleStyles[level], colorStyles[color], fontStyles[font], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

type ParagraphProps = ComponentPropsWithoutRef<'p'> & {
  size?: TextSize;
  color?: TypographyColor;
  font?: TypographyFont;
};

function Paragraph({
  size = 'base',
  color = 'muted',
  font = 'sans',
  className,
  children,
  ...props
}: ParagraphProps) {
  return (
    <p className={cn(textSizes[size], colorStyles[color], fontStyles[font], className)} {...props}>
      {children}
    </p>
  );
}

type TextProps = ComponentPropsWithoutRef<'span'> & {
  as?: 'span' | 'p' | 'label' | 'strong';
  size?: TextSize;
  color?: TypographyColor;
  font?: TypographyFont;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
};

const weightStyles = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
} as const;

function Text({
  as: Tag = 'span',
  size = 'base',
  color = 'default',
  font = 'sans',
  weight = 'normal',
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        textSizes[size],
        colorStyles[color],
        fontStyles[font],
        weightStyles[weight],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

type LabelProps = ComponentPropsWithoutRef<'label'> & {
  color?: TypographyColor;
  font?: TypographyFont;
  required?: boolean;
};

function Label({
  color = 'default',
  font = 'sans',
  required,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        'text-sm leading-6 font-medium',
        colorStyles[color],
        fontStyles[font],
        className,
      )}
      {...props}
    >
      {children}
      {required ? <span className="ml-0.5 text-primary">*</span> : null}
    </label>
  );
}

const Typography = {
  Title,
  Paragraph,
  Text,
  Label,
};

export { Label, Paragraph, Text, Title };
export default Typography;
