//Form Section Props
interface FormDataProps {
  children: React.ReactNode;
}


//Assumes only one form group per page
export const FormData: React.FC<FormDataProps> = ({ children }) => {

  return (
    <div>{children}</div>
  );
};

export default FormData;