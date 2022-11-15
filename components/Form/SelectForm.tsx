import { memo, useCallback, useState } from "react";
import styles from "./style";

type Props = {
  label: string;
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options: any[];
  required?: boolean;
};

const SelectForm = memo(({ label, onchange, required, options }: Props) => {
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
          <select
            className={styles.fieldForm.field}
            placeholder="Type something here"
            onChange={handleOnchange}
          >
            <>
              {options.map((option, index) => {
                return (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                );
              })}
            </>
          </select>
        </div>
      </div>
    </>
  );
});

SelectForm.displayName = "SelectForm";

export default SelectForm;
