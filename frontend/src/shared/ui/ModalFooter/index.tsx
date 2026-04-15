import { Button, type ButtonProps } from 'antd';

const ModalFooter = ({ buttons = [] }: { buttons: ButtonProps[] }) => (
  <>
    {buttons.map((btn, index) => (
      <Button key={index} {...btn} />
    ))}
  </>
);

export default ModalFooter;
