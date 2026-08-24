import type { ReactNode } from "react";


export type ActionMenuItem = {
    label: string;
    onClick : () =>  void;
    icon?: ReactNode;
    disabled?: boolean;
    hidden?: boolean;
}

export type ActionsMenuProps = {
    actions: ActionMenuItem[];
    ariaLabel?: string;
    tooltip?: string;
}
