import { useEffect, useState } from 'react';
import Switch from '@material-ui/core/Switch';
import storageService from '../../../utils/storageService';
import { updateChatUserDetails } from '../../../services/firebase';
interface Setting {
  pushNotificationCategory: []
}

interface Props {
  getSettings: () => void;
  updateSettings: (settings: any) => void;
  settings: Setting;
}

const NOTIFICATION_CATEGORY = { //for api reference
  CHAT: 1,
  PAYMENT: 2,
  ADMIN_UPDATE: 3,
  MILESTONE_UPDATE: 4,
  REVIEW: 5,
  VOUCH: 6,
  CHANGE_REQUEST: 7,
  CANCELATION: 8,
  DISPUTE: 9,
  QUESTION: 10
}

const USER_TRADIE_NOTIF = [
  { value: 'Chat', number: 1 },
  { value: 'Payment', number: 2 },
  { value: 'New updates from admin', number: 3 },
  { value: 'Milestone updates', number: 4 },
  { value: 'Job review updates', number: 5 },
  { value: 'Vouches updates', number: 6 },
  { value: 'Change request updates', number: 7 },
  { value: 'Cancelation updates', number: 8 },
  { value: 'Dispute updates', number: 9 },
  { value: 'Job answers updates', number: 10 }
];
const USER_BUILDER_NOTIF = [
  { value: 'Chat', number: 1 },
  { value: 'Payment', number: 2 },
  { value: 'New updates from admin', number: 3 },
  { value: 'Milestone updates', number: 4 },
  { value: 'Job review updates', number: 5 },
  { value: 'Change request updates', number: 7 },
  { value: 'Cancelation updates', number: 8 },
  { value: 'Dispute updates', number: 9 },
  { value: 'Job queries updates', number: 10 }
];

const Settings = ({ getSettings, updateSettings, settings }: Props) => {
  const [pushCategory, setPushCategory] = useState<Array<number>>([]);
  const [updatedSettingNo, setUpdatedSettingNo] = useState<number>(0);

  useEffect(() => {
    getSettings();
  }, [getSettings]);

  useEffect(() => {
    if (Array.isArray(settings?.pushNotificationCategory)) {
      setPushCategory(settings?.pushNotificationCategory);
    }
  }, [settings]);

  useEffect(() => {
    if (pushCategory.length > 0 && updatedSettingNo) {
      const val: boolean = pushCategory.includes(1) ? true : false;
      updateChatUserDetails('isNotification', val);
      setUpdatedSettingNo(0);
    }
  }, [pushCategory]);

  const handleChange = (val: number, isValExist: boolean) => {
    if (val === 1) setUpdatedSettingNo(val);
    let updatedPushNotif: any;
    if (isValExist) {
      updatedPushNotif = [...pushCategory].filter(i => i !== val);
    } else {
      const category = [...pushCategory];
      category.push(val);
      updatedPushNotif = category;
    }
    updateSettings({ pushNotificationCategory: updatedPushNotif });
  };

  const PUSH_NOTIF_ARRAY = storageService.getItem('userType') === 1 ? USER_TRADIE_NOTIF : USER_BUILDER_NOTIF;

  return (
    <div className="flex_row p_settings">
      <div className="flex_col_sm_7">
        <span className="sub_title mb50">Settings</span>
        <div className="form_field">
          <span className="inner_title">Push Notifications</span>
          <span className="info_note">
            Receive notifications from users, including notifications about new jobs
          </span>
        </div>
        {PUSH_NOTIF_ARRAY.map(({ value, number }: { value: string, number: number }) => {
          const isValExist = pushCategory?.includes(number);
          return (
            < div className="f_spacebw form_field">
              <span className="form_label">{value}</span>
              <div className="toggle_btn">
                <Switch
                  checked={isValExist}
                  onClick={() => handleChange(number, isValExist)}
                  inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default Settings;
