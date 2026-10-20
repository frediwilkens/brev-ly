import { LinkSimpleIcon } from "@phosphor-icons/react";
import { LinksDivider } from "./links-divider";

export function EmptyLinksState() {
  return (
    <div className="flex w-full flex-col gap-3 sm:gap-4">
      <LinksDivider />
      <div className="flex w-full flex-col items-center justify-center gap-3 pb-6 pt-4">
        <LinkSimpleIcon size={32} color="#74798B" aria-hidden="true" />
        <p className="h-4.5 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-xxs uppercase leading-3.5 text-gray-500">
          Ainda não existem links cadastrados
        </p>
      </div>
    </div>
  );
}
