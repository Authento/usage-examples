import { type FormEvent, useCallback, Dispatch, SetStateAction } from "react";

interface VerificationTypeSelectorProps {
  verificationType: VerificationType;
  setVerificationType: Dispatch<SetStateAction<VerificationType>>;
}

export const VerifiactionTypeSelector = ({
  verificationType,
  setVerificationType,
}: VerificationTypeSelectorProps) => {
  const handleVerificationTypeChange = useCallback(
    (event: FormEvent<HTMLInputElement>) => {
      setVerificationType(event.currentTarget.value as VerificationType);
    },
    [setVerificationType]
  );

  return (
    <div id="radio-container">
      <label>
        <input
          type="radio"
          value="INDIVIDUAL"
          checked={verificationType === "INDIVIDUAL"}
          onChange={handleVerificationTypeChange}
        />
        KYC
      </label>
      <label>
        <input
          type="radio"
          value="CORPORATE"
          checked={verificationType === "CORPORATE"}
          onChange={handleVerificationTypeChange}
        />
        KYB
      </label>
    </div>
  );
};
