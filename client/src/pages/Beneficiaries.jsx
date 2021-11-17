import React from "react";
import Index from "../containers/Beneficiaries/Beneficiaries";

const data = [
  {
    name: "Erika Jaquez",
    date: "Nov 15 2021",
    address: "0x3f5D802a35D1B9eF97F469d732D12EC34Da90c24",
    trustAddress: "0x2906679ca71903561b10edBfc6Cf474A7a367AEC"
  },
  {
    name: "Veronika Natschke",
    date: "Nov 15 2021",
    address: "0xBEa0F2186459695b8b95b4bD4Ffaf796aD9569Ca",
    trustAddress: "0x166216E5A69676C8EE89B715cD5aB265f953adcF"
  },
  {
    name: "Enzo Natschke",
    date: "Nov 15 2021",
    address: "0xCF0F71C4D8553D8D72FC22EC1D8C45DA177BDCE3",
    trustAddress: "0x483aB04476e853a814B75d7fC5F83a2fe91dCf2f"
  },
];

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = React.useState(data);
  const [selected, setSelected] = React.useState({});

  const handleSelected = (selected) => {
    console.log(selected);
    setSelected(selected);
  };

  const deleteBeneficiary = (selected) => {
    setBeneficiaries( beneficiaries.filter( b => b.address !== selected.address ) );
  };

  const addBeneficiary = (beneficiary) => {
    if (beneficiaries.find( b => b.address === beneficiary.address ) !== undefined ){
      console.error("beneficiary already present")
      return
    }
    setBeneficiaries( [...beneficiaries, beneficiary] )
  }

  return (
    <Index
      beneficiaries={beneficiaries}
      handleSelected={handleSelected}
      selected={selected}
      deleteBeneficiary={deleteBeneficiary}
      addBeneficiary={addBeneficiary}
    />
  );
}
