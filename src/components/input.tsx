// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import { HTMLAttributes } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';

type Props = {
  type?: string;
  label?: string;
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  maxLength?: number;
  minLength?: number;
  error?: string;
  disabled?: boolean;
  value?: string;
  width?: string;
  inputMode?: HTMLAttributes<HTMLLIElement>['inputMode'];
  pattern?: string;
  onChange?: (value: any) => void;
  onBlur?: (value: any) => void;
};

const Input = ({
  type = 'text',
  label,
  name,
  placeholder,
  register,
  required = false,
  maxLength,
  minLength,
  error,
  disabled = false,
  value,
  width,
  inputMode,
  pattern,
  onChange,
  onBlur,
}: Props) => {
  const classNameError = error
    ? 'border-2 border-pink-FF3355'
    : 'border-black-25';
  const classNameWidth = width ? `w-[${width}px]` : 'w-full';
  const classDisabled = disabled ? 'bg-black-15 border-0 text-black-50' : '';

  return (
    <div className='mt-3'>
      {label && (
        <div className='flex items-center'>
          <p
            className={`mb-2 ${
              error ? 'text-red-E62E2E' : 'text-black-1A2533'
            }`}
          >
            {label}
          </p>
          {name === 'middleName' && (
            <p className='text-green ml-2 mb-2 font-weight-600 px-1 py-0.5 bg-green-10 rounded text-base-11-120 min-w-[30px]'>
              任意
            </p>
          )}
        </div>
      )}
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        className={`height-11 rounded-md p-3 border outline-0 text-base-16-120 ${classNameWidth} ${classNameError} ${classDisabled}`}
        {...register(name, {
          required,
          maxLength,
          minLength,
          pattern,
        } as RegisterOptions)}
        placeholder={placeholder}
        disabled={disabled}
        onChange={onChange}
        onBlur={onBlur}
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

export default Input;
