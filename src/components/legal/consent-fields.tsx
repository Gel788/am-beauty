import Link from "next/link";
import { company, legalLinks } from "@/data/company";

type ConsentFieldsProps = {
  acceptOffer: boolean;
  acceptPrivacy: boolean;
  onAcceptOfferChange: (v: boolean) => void;
  onAcceptPrivacyChange: (v: boolean) => void;
  offerError?: string;
  privacyError?: string;
};

export function ConsentFields({
  acceptOffer,
  acceptPrivacy,
  onAcceptOfferChange,
  onAcceptPrivacyChange,
  offerError,
  privacyError,
}: ConsentFieldsProps) {
  return (
    <fieldset className="space-y-3 border-0 p-0">
      <legend className="sr-only">Согласия</legend>
      <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-grey">
        <input
          type="checkbox"
          checked={acceptPrivacy}
          onChange={(e) => onAcceptPrivacyChange(e.target.checked)}
          className="mt-1 size-4 shrink-0 accent-black"
          aria-invalid={Boolean(privacyError)}
        />
        <span>
          Даю{" "}
          <Link href={legalLinks.privacy} className="text-black underline underline-offset-2" target="_blank">
            согласие на обработку персональных данных
          </Link>{" "}
          в соответствии с 152-ФЗ для оформления и доставки заказа.
        </span>
      </label>
      {privacyError ? <p className="text-xs text-destructive">{privacyError}</p> : null}

      <label className="flex cursor-pointer gap-3 text-sm leading-relaxed text-grey">
        <input
          type="checkbox"
          checked={acceptOffer}
          onChange={(e) => onAcceptOfferChange(e.target.checked)}
          className="mt-1 size-4 shrink-0 accent-black"
          aria-invalid={Boolean(offerError)}
        />
        <span>
          Принимаю условия{" "}
          <Link href={legalLinks.offer} className="text-black underline underline-offset-2" target="_blank">
            публичной оферты
          </Link>
          ,{" "}
          <Link href={legalLinks.delivery} className="text-black underline underline-offset-2" target="_blank">
            доставки и оплаты
          </Link>{" "}
          и{" "}
          <Link href={legalLinks.returns} className="text-black underline underline-offset-2" target="_blank">
            возврата
          </Link>
          .
        </span>
      </label>
      {offerError ? <p className="text-xs text-destructive">{offerError}</p> : null}

      <p className="text-xs text-grey">
        Цены на сайте указаны в рублях РФ, включают НДС (не облагается при применении УСН, если применимо).
        Продавец: {company.shortLegalName}, ИНН {company.inn}.
      </p>
    </fieldset>
  );
}
