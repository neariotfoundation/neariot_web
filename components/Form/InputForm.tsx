import { memo, useCallback, useState } from "react";
import styles from "./style";

type Props = {
  label: string;
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const InputForm = memo(({ label, onchange, required }: Props) => {
  const [value, setValue] = useState<any>("");

  const handleOnchange = useCallback(
    (e: any) => {
      setValue(e.target.value);
      onchange(e.target.value);
    },
    [value]
  );

  return (
    <>
       <div className={styles.wrapper}>
        <div className={styles.label}>
          <label htmlFor={"inp" + label}>{label} </label>
          {required ? <span className={styles.required}>*</span> : null}
        </div>
        <div className={styles.fieldForm.wrapper}>
          <input
            id={"inp"+label}
            type="text"
            name={"inp"+label}
            className={styles.fieldForm.field}
            placeholder="Type something here"
            onChange={handleOnchange}
          />
        </div>
      </div>
    </>
  );
});

InputForm.displayName = "InputForm";

export default InputForm;
