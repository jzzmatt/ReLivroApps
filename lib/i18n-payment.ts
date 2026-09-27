import type {Locale} from "@/lib/i18n";
import type {PaymentArrangement} from "@/lib/books";

export const paymentMessages = {
  pt: {
    label: "Como combinar o pagamento",
    hint: "A ReLivroApps não cobra. Esta escolha fica visível no anúncio.",
    arrangements: {
      "A combinar": "A combinar",
      Transferência: "Transferência",
      Dinheiro: "Dinheiro",
    } as Record<PaymentArrangement, string>,
  },
  fr: {
    label: "Comment convenir du paiement",
    hint: "ReLivroApps n’encaisse pas. Ce choix est visible sur l’annonce.",
    arrangements: {
      "A combinar": "À convenir",
      Transferência: "Virement",
      Dinheiro: "Espèces",
    } as Record<PaymentArrangement, string>,
  },
  en: {
    label: "How to arrange payment",
    hint: "ReLivroApps does not take payment. This choice is shown on the listing.",
    arrangements: {
      "A combinar": "To be agreed",
      Transferência: "Bank transfer",
      Dinheiro: "Cash",
    } as Record<PaymentArrangement, string>,
  },
} as const satisfies Record<Locale, unknown>;

export function paymentT(locale: Locale) {
  return paymentMessages[locale] ?? paymentMessages.pt;
}
