// gkc_hash_code : 01GV08E07716MKFVFKX31BQC9G
type Props = {
  content: string;
  isShow: boolean;
  textBtnOk?: string;
  handleOk?: () => void;
  handleCancel?: () => void;
};

const ModalError = ({
  content,
  isShow,
  textBtnOk = 'OK',
  handleCancel,
  handleOk,
}: Props) => {
  return (
    <>
      {isShow && (
        <div>
          <div className='w-screen h-screen bg-black-50 fixed z-10'></div>
          <div className='flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50'>
            <div className='w-[288px] rounded-xl shadow-lg relative bg-white'>
              <div
                className='py-6 px-4 border-b-1 border-black-rgba-01'
                dangerouslySetInnerHTML={{ __html: content }}
              />
              <div className='flex justify-center gap-4 py-3 px-4'>
                {handleOk && (
                  <button
                    className='bg-red-E62E2E rounded-md h-11 w-full text-white text-base-14-100'
                    onClick={handleOk}
                  >
                    {textBtnOk}
                  </button>
                )}
                {handleCancel && (
                  <button
                    className='bg-red-E62E2E rounded-md h-11 w-full text-white text-base-14-100'
                    onClick={handleCancel}
                  >
                    閉じる
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalError;
