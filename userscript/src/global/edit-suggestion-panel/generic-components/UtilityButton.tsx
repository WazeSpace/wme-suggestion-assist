import { WzButton } from '@wazespace/wme-react-components';
import clsx from 'clsx';
import { SyntheticEvent } from 'react';

interface UtilityButtonProps {
  iconName: string;
  label: string;
  onClick(event: SyntheticEvent): void;
  isBusy?: boolean;
}
export function UtilityButton({
  iconName,
  label,
  onClick,
  isBusy = false,
}: UtilityButtonProps) {
  return (
    <wz-basic-tooltip>
      <wz-tooltip-source>
        <WzButton busy={isBusy} size="sm" color="clear-icon" onClick={onClick}>
          <i className={clsx('w-icon', `w-icon-${iconName}`)} />
        </WzButton>
      </wz-tooltip-source>
      <wz-tooltip-target></wz-tooltip-target>
      <wz-tooltip-content position="top">{label}</wz-tooltip-content>
    </wz-basic-tooltip>
  );
}
