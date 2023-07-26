// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps {
  name: string;
  onChange: (value: any) => void;
  onBlur?: (value: any) => void;
  value: string;
  error: string;
  disabled?: boolean;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({
  name,
  value,
  error,
  onChange,
  onBlur,
  disabled,
}) => {
  const classNameError = error
    ? 'border-2 border-pink-FF3355'
    : 'border-black-25';

  return (
    <div className='mt-3'>
      <DatePicker
        id={name}
        selected={value ? moment(value).toDate() : null}
        onChange={date => onChange(date)}
        onBlur={onBlur}
        disabled={disabled}
        dateFormat='yyyy/MM/dd'
        className={`bg-calender w-full rounded border border-black-25 p-3 ${classNameError}`}
        onFocus={e => (e.target.readOnly = true)}
      />
      {error && (
        <p className='flex align-items-center mt-1.5'>
          <span className='icon-icon-report'></span>
          <span className='text-pink-FF3355 text-base-12-120 pl-1'>
            {error}
          </span>
        </p>
      )}
    </div>
  );
};

export default CustomDatePicker;
