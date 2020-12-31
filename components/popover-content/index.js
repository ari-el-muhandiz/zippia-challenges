import PropTypes from 'prop-types';
import { Button } from 'antd';
import InputAutoComplete from '../autocomplete';
import styles from './popover-content.module.css';
import { useRef, useState } from 'react';

const PopoverContent = ({
    options,
    inputPlaceHolder,
    onClearFilter,
    onApplyFilter,
    selectedValue,
    valueOptions
}) => {
    const [value, setValue] = useState('');
    // hold the child component ref
    const inputRef = useRef(null);
    return (
    <>
      <InputAutoComplete 
        dataOptions={options} 
        placeholder={inputPlaceHolder} 
        onSelect={(value) => setValue(value)}
        ref={inputRef}
      />
      <div className={styles.buttonOptions}>
        {valueOptions.length > 0 && valueOptions.map((option, i) => (
          <Button 
            type={option === selectedValue ? 'primary' : 'default'} 
            key={`button-${i}`}
            onClick={() => { 
              if(option !== selectedValue) {
                onApplyFilter(option);
                // reset child component defaultValue
                inputRef.current.resetValue()
              }
            }}>
                {option}
          </Button>
        ))}
      </div>
      <div className={styles.buttonGrid}>
          <Button type='default' onClick={() => {
            onClearFilter();
            // reset child component defaultValue
            inputRef.current.resetValue()
          }}>Clear</Button>
          <Button disabled={!value} type='primary' onClick={() => {
            onApplyFilter(value);
            // reset child component defaultValue
            inputRef.current.resetValue()
          }}>Apply</Button>
      </div>
    </>)
}

PopoverContent.propTypes = {
    options: PropTypes.arrayOf(PropTypes.any),
    inputPlaceHolder: PropTypes.string,
    onClearFilter: PropTypes.func,
    onApplyFilter: PropTypes.func,
    selectedValue: PropTypes.string,
    valueOptions: PropTypes.arrayOf(PropTypes.any)
}

PopoverContent.defaultProps = {
    options: [],
    inputPlaceHolder: '',
    onClearFilter: () => {},
    onApplyFilter: () => {},
    selectedValue: '',
    valueOptions: []
}

export default PopoverContent;