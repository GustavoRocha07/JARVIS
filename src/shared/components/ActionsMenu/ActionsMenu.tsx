import { useState } from "react";
import type { ActionsMenuProps } from "./ActionsMenu.types";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
export const ActionsMenu = ({ actions, ariaLabel, tooltip }: ActionsMenuProps) => {

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

    const open = Boolean(anchorEl);

    const handleOpen = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.stopPropagation();

        setAnchorEl(event.currentTarget);

    };

    const handleClose = () => {


        setAnchorEl(null);
    };

    const handleAction = (
        action: () => void,
    ) => {
        action();

        setAnchorEl(null);
    };

    const visibleActions = actions.filter(
        (action) => !action.hidden,
    );

    return (
        <>
            <Tooltip title={tooltip}>
                <IconButton
                    size="small"
                    aria-label={ariaLabel}
                    onClick={handleOpen}
                >
                    <MoreHorizIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={(event) =>
                    event.stopPropagation()
                }
            >
                {visibleActions.map((action) => (
                    <MenuItem
                        key={action.label}
                        sx={{
                            padding: '1rem'
                        }}
                        disabled={action.disabled}
                        onClick={() =>
                            handleAction(action.onClick)
                        }
                    >
                        {action.icon && (
                            <ListItemIcon>
                                {action.icon}
                            </ListItemIcon>
                        )}

                        <ListItemText>
                            {action.label}
                        </ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    )

}