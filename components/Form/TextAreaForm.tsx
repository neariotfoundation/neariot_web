import { memo, useCallback, useState } from "react";
import styles from "./style";

type Props = {
  label: string;
  onchange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const TextAreaForm = memo(({ label, onchange, required }: Props) => {
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
        <div className={styles.labelArea}>
          <label htmlFor={"inp" + label}>{label} </label>
          {required ? <span className={styles.required}>*</span> : null}
        </div>
        <div className={styles.fieldForm.wrapper}>
          <textarea
            id="inpDes"
            name="inpDes"
            placeholder="Type something here"
            className={styles.fieldForm.textarea}            
            onChange={handleOnchange}
          />
        </div>
      </div>
    </>
  );
});

TextAreaForm.displayName = "TextAreaForm";

export default TextAreaForm;
