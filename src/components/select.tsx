// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select, { components } from 'react-select';
import Image from 'next/image';

type Props = {
  name: string;
  instanceId: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  control: Control<any>;
  options: object[];
  disabled?: boolean;
  onBlur?: (value: any) => void;
  onChange?: (value: any) => void;
};

const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <Image
        src='/view/icons/dropdown.png'
        width='0'
        height='0'
        alt='Image icon dropdown'
        style={{ width: '12px', height: '7px' }}
      />
    </components.DropdownIndicator>
  );
};

const Input = ({
  name,
  instanceId,
  placeholder,
  required = false,
  error,
  control,
  options,
  disabled,
  onBlur,
  onChange,
}: Props) => {
  const classNameError = error && 'react-dropdown-error';
  const classNameDisabled = disabled && 'border-1 border-black-25';

  return (
    <div className='mt-3'>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <Select
            {...field}
            instanceId={instanceId}
            isSearchable={false}
            className={`react-dropdown bg-danger rounded ${classNameError} ${classNameDisabled}`}
            classNamePrefix='dropdown'
            options={options}
            placeholder={placeholder}
            components={{ DropdownIndicator }}
            isDisabled={disabled}
            onBlur={onBlur}
            onChange={onChange}
            styles={{
              option: (style, state) => {
                let backgroundColor = 'white';
                if (state.isSelected) {
                  backgroundColor = '#2563eb';
                }
                return {
                  ...style,
                  backgroundColor,
                };
              },
            }}
          />
        )}
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
