import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import CustomButton from "../CustomButton";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

const style = {
  arrow: {
    up: "w-0 h-0 border border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-transparent border-b-[16px] border-emerald-500 transform cursor-pointer ",
    down: "w-0 h-0 border border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-transparent border-t-[16px] border-emerald-500 transform cursor-pointer ",
    right:
      "w-0 h-0 border border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-transparent border-l-[16px] border-emerald-500 transform cursor-pointer ",
    left: "w-0 h-0 border border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-l-transparent border-r-[16px] border-emerald-500 transform cursor-pointer ",
  },
  circle: {
    green: "w-4 h-4 rounded-full bg-emerald-500",
    red: "w-4 h-4 rounded-full bg-red-500",
    yellow: "w-4 h-4 rounded-full bg-yellow-500",
    blue: "w-4 h-4 rounded-full bg-blue-500",
    gray: "w-4 h-4 rounded-full bg-gray-500",
  },
};

type Props = {
  onShow: boolean;
  onClose: (data: any) => void;
  onConfirm: (data: any) => void;
};

export default function NewOffer({ onShow, onClose, onConfirm }: Props) {
  const [open, setOpen] = React.useState(false);
  const [withoutReward, setWithoutReward] = React.useState<any>({
    enabled: false,
    collapsed: false,
  });
  const [reward, setReward] = React.useState<any>({
    enabled: false,
    collapsed: false,
  });
  const [milestoneDate, setMilestoneDate] = React.useState<Dayjs | null>(
    dayjs(new Date())
  );
  const [formFields, setFormFields] = React.useState<any[]>([]);
  const [data, setData] = React.useState<any>({
    reward: false,
    minPledge: 0,
    description: "",
    rewardDetail: "",
    rewardDeadline: new Date().getTime(),
    informationForm: [],
  });

  React.useEffect(() => {
    setOpen(onShow);
  }, [onShow]);

  const handleClose = () => {
    setOpen(false);
    onClose?.(false);
  };

  const handleConfirm = (e: any) => {
    e.preventDefault();
    // setOpen(false);
    // onClose?.(true);
    onConfirm?.(data);
  };

  const handleChangeMilestoneDate = (date: Dayjs | null) => {
    setMilestoneDate(date);
    setData({
      ...data,
      rewardDeadline: new Date(dayjs(date).format("YYYY-MM-DD")).getTime(),
    });
  };
  const onKeyDown = (e: any) => {
    e.preventDefault();
  };

  const handleAddField = () => {
    setFormFields([
      ...formFields,
      { id: new Date().getTime(), name: "", value: "" },
    ]);
  };

  const handleSetData = (dataProps: any) => {
    const { id, name, value } = dataProps;
    if (!name) return;
    let _data: any = { ...data };
    const index = _data.informationForm?.findIndex(
      (item: any) => item.id === id
    );
    if (index > -1) {
      _data.informationForm[index] = { id: id, [name]: value };
    } else {
      _data.informationForm?.push({ id: id, [name]: value });
    }
    setData(_data);
  };

  const renderForm = React.useCallback(() => {
    return formFields.map((field, index) => {
      return (
        <TextForm
          key={field.id}
          id={field.id}
          name={field.name}
          value={field.value}
          onChange={(data: any) => {
            handleSetData(data);
          }}
          onRemove={() => {
            const newFormFields = [...formFields];
            newFormFields.splice(index, 1);
            setFormFields(newFormFields);
          }}
        />
      );
    });
  }, [formFields]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="text-center rounded-full"
      >
        <form onSubmit={handleConfirm} className="">
          <DialogTitle id="alert-dialog-title">
            {"Config your offer"}
          </DialogTitle>
          <DialogContent className="md:min-w-[500px] w-full">
            {/* {renderForm()} */}
            <div className="w-full border border-purple rounded-lg my-2">
              <div className="flex flex-rows w-full p-4 text-center items-center">
                <div
                  onClick={() => {
                    setWithoutReward({
                      enabled: !withoutReward.enabled,
                      collapsed: !withoutReward.collapsed,
                    });
                    setData({ ...data, reward: false });
                    setReward({
                      enabled: false,
                      collapsed: false,
                    });
                  }}
                  className={
                    (!withoutReward.collapsed && !withoutReward.enabled
                      ? style.circle.gray
                      : style.circle.green) + " flex mr-2"
                  }
                ></div>
                <span className="text-center w-full md:mr-4 font-semibold">
                  Pledge without reward
                </span>
              </div>
              {withoutReward.collapsed && withoutReward.enabled && (
                <>
                  <div className="w-full p-4 text-left">
                    <div className="w-full flex md:flex-row flex-col items-center mb-2">
                      <label className="md:w-2/5 w-full">
                        Min. Pledge Amount
                      </label>
                      <input
                        className="md:w-3/5 w-full border border-purple rounded-lg p-2"
                        onChange={(e: any) =>
                          setData({ ...data, minPledge: e.target.value })
                        }
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </div>
                    <div className="w-full flex md:flex-row flex-col items-center mb-2">
                      <label className="md:w-2/5 w-full">Description</label>
                      <input
                        className="md:w-3/5 w-full border border-purple rounded-lg p-2"
                        onChange={(e: any) =>
                          setData({ ...data, description: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
              {/* {renderContent()} */}
            </div>
            <div className="w-full border border-purple rounded-lg my-2">
              <div className="flex flex-rows w-full p-4 text-center items-center">
                <div
                  onClick={() => {
                    setReward({
                      enabled: !reward.enabled,
                      collapsed: !reward.collapsed,
                    });
                    setData({ ...data, reward: true });
                    setWithoutReward({
                      enabled: false,
                      collapsed: false,
                    });
                  }}
                  className={
                    (!reward.collapsed && !reward.enabled
                      ? style.circle.gray
                      : style.circle.green) + " flex mr-2"
                  }
                ></div>
                <span className="text-center w-full md:mr-4 font-semibold">
                  Custom reward
                </span>
              </div>
              {reward.collapsed && reward.enabled && (
                <>
                  <div className="w-full p-4 text-left">
                    <div className="w-full flex md:flex-row flex-col items-center mb-2">
                      <label className="md:w-2/5 w-full">
                        Min. Pledge Amount
                      </label>
                      <input
                        className="md:w-3/5 w-full border border-purple rounded-lg p-2"
                        onChange={(e: any) =>
                          setData({ ...data, minPledge: e.target.value })
                        }
                        onKeyPress={(event) => {
                          if (!/[0-9]/.test(event.key)) {
                            event.preventDefault();
                          }
                        }}
                      />
                    </div>
                    <div className="w-full flex md:flex-row flex-col items-center mb-2">
                      <label className="md:w-2/5 w-full">Description</label>
                      <input
                        className="md:w-3/5 w-full border border-purple rounded-lg p-2"
                        onChange={(e: any) =>
                          setData({ ...data, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="w-full flex md:flex-row flex-col items-center mb-2">
                      <label className="md:w-2/5 w-full">Reward Details</label>
                      <input
                        className="md:w-3/5 w-full border border-purple rounded-lg p-2"
                        onChange={(e: any) =>
                          setData({ ...data, rewardDetail: e.target.value })
                        }
                      />
                    </div>
                    <div className="w-full flex md:flex-row flex-col items-center mb-2">
                      <label className="md:w-2/5 w-full">Reward Deadline</label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disablePast
                          openTo="day"
                          value={milestoneDate}
                          className="md:w-3/5 w-full border border-purple rounded-lg p-2"
                          onChange={handleChangeMilestoneDate}
                          renderInput={(params) => (
                            <TextField onKeyDown={onKeyDown} {...params} />
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                    <div className="text-center font-semibold mb-2">
                      Reward Information Form
                    </div>
                    {renderForm()}
                    <div className="w-full mb-2">
                      <CustomButton
                        _type="button"
                        className_box=" py-1  w-full mx-auto my-2"
                        className_button="py-1"
                        label="Add field"
                        onClickButton={handleAddField}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <CustomButton
              className_box=" py-2 w-1/5 mx-4 my-4"
              className_button="py-2"
            />
            <CustomButton
              className_box=" py-2 w-1/5 mx-4 my-4"
              className_button="py-2"
              _type="button"
              label="Cancel"
              onClickButton={handleClose}
            />
            {/* <Button type="submit" autoFocus>
              {"Submit"}
            </Button>
            <Button onClick={handleClose}>Cancel</Button> */}
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

interface LooseObject {
  [key: string]: any;
}

const TextForm = ({ id, label, value, onChange, onRemove }: any) => {
  const [field, setField] = React.useState("");
  const [fieldValue, setFieldValue] = React.useState("");

  React.useEffect(() => {
    if (label) {
      setField(label);
    }
    if (value) {
      setFieldValue(value);
    }
  }, [label, value]);

  const handleOnchange = (e: any) => {
    onChange(e.target.value);
  };
  React.useEffect(() => {
    // const data = { id: id, field: fieldValue };
    let data: LooseObject = { id: id, name: field, value: fieldValue };
    onChange?.(data);
  }, [field, fieldValue]);

  return (
    <div className="w-full flex md:flex-row flex-col items-center mb-2 relative">
      <div className="md:w-2/5 w-full ">
        <div className="flex flex-row w-full items-center">
          <div className="cursor-pointer" onClick={onRemove}>
            <RemoveCircleOutlineIcon className="text-red-600" />
          </div>
          <input
            value={field}
            onChange={(e: any) => setField(e.target.value)}
            placeholder="Key"
            className="w-full pl-4 border border-purple rounded-lg p-2 mx-4"
          />
        </div>
      </div>
      <input
        value={fieldValue}
        onChange={(e: any) => setFieldValue(e.target.value)}
        placeholder="Value"
        className="md:w-3/5 w-full border border-purple rounded-lg p-2"
      />
    </div>
  );
};
