import Container from '@/UI/Elements/Container/Container';
import { Switch } from '@/UI/Elements/Switch/Switch';
import Text from '@/UI/Elements/Text';
import { Label } from '@/UI/Elements/Text/Label';
import { useAppDispatch, useAppSelector } from '@/core/store/types';
import { SettingsActions, SettingsSelectors } from '@/features/settings/store';
import { SettingsKey } from '@/features/settings/store/settings.type';
import { useEffect } from 'react';

function SettingsPage() {
  const dispatch = useAppDispatch();
  const test = useAppSelector((state) =>
    SettingsSelectors.getSettingByKey(state)(SettingsKey.test),
  );
  const onTestChange = () => {
    dispatch(
      SettingsActions.setItem({
        key: SettingsKey.test,
        value: !test,
      }),
    );
  };

  useEffect(() => {
    dispatch(SettingsActions.loadState());
  }, [dispatch]);

  return (
    <Container>
      <Text
        size="7"
        as="p"
      >
        Settings
      </Text>
      <div className="flex items-center space-x-2 pt-5">
        <Switch
          id="settings-mode"
          checked={test}
          value={test}
          onCheckedChange={onTestChange}
        />
        <Label htmlFor="settings-mode">Test Setting</Label>
      </div>
    </Container>
  );
}

export default SettingsPage;
