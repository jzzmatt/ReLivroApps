import type {Locale} from "@/lib/i18n";
import {grades, subjects} from "@/lib/books";

type Subject = (typeof subjects)[number];
type Grade = (typeof grades)[number];

const subjectLabels: Record<Locale, Record<Subject, string>> = {
  pt: {
    Matemática: "Matemática",
    Português: "Português",
    Física: "Física",
    Biologia: "Biologia",
    História: "História",
    Geografia: "Geografia",
  },
  fr: {
    Matemática: "Mathématiques",
    Português: "Portugais",
    Física: "Physique",
    Biologia: "Biologie",
    História: "Histoire",
    Geografia: "Géographie",
  },
  en: {
    Matemática: "Mathematics",
    Português: "Portuguese",
    Física: "Physics",
    Biologia: "Biology",
    História: "History",
    Geografia: "Geography",
  },
};

const gradeLabels: Record<Locale, Record<Grade, string>> = {
  pt: {
    "7ª Classe": "7ª Classe",
    "8ª Classe": "8ª Classe",
    "9ª Classe": "9ª Classe",
    "10ª Classe": "10ª Classe",
    "11ª Classe": "11ª Classe",
    "12ª Classe": "12ª Classe",
  },
  fr: {
    "7ª Classe": "7e année",
    "8ª Classe": "8e année",
    "9ª Classe": "9e année",
    "10ª Classe": "10e année",
    "11ª Classe": "11e année",
    "12ª Classe": "12e année",
  },
  en: {
    "7ª Classe": "Grade 7",
    "8ª Classe": "Grade 8",
    "9ª Classe": "Grade 9",
    "10ª Classe": "Grade 10",
    "11ª Classe": "Grade 11",
    "12ª Classe": "Grade 12",
  },
};

export function labelSubject(subject: string, locale: Locale): string {
  const map = subjectLabels[locale] ?? subjectLabels.pt;
  return (map as Record<string, string>)[subject] ?? subject;
}

export function labelGrade(grade: string, locale: Locale): string {
  const map = gradeLabels[locale] ?? gradeLabels.pt;
  return (map as Record<string, string>)[grade] ?? grade;
}

export function subjectOptions(locale: Locale): {value: Subject; label: string}[] {
  return subjects.map((value) => ({value, label: labelSubject(value, locale)}));
}

export function gradeOptions(locale: Locale): {value: Grade; label: string}[] {
  return grades.map((value) => ({value, label: labelGrade(value, locale)}));
}
