import { AutoComplete, Input } from 'antd';
import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useState } from 'react';
import styles from './autocomplete.module.css';

// child component use forwaredRef, so the parent can access and change the state
const InputAutoComplete = forwardRef(({
    dataOptions,
    placeholder,
    onSelect
}, ref) => {
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState('');
  
  const resetValue = () => {
    setDefaultValue('')
  }
  // function to handle search in auto complete based on dataOptions from parent component
  const onHandleSearch = (value) => {
    const filteredData = dataOptions
    .filter((data) => data.toLowerCase().includes(value.toLowerCase()))
    .map((data) => ({
        value: data,
        label: data
    }));
    setOptions(filteredData);
  }
  
  useImperativeHandle(ref, () => {
    return {
      resetValue: resetValue
    }
  })
  return (
    <AutoComplete 
      options={options}
      className={styles.autoComplete}
      onSearch={onHandleSearch}
      onChange={(value) => {
        setDefaultValue(value);
      }}
      onSelect={(val) => { 
        onSelect(val); 
      }}
      value={defaultValue}
    > 
      <Input
        placeholder={placeholder}
        suffix={
          <img
            alt="search"
            src='https://www.zippia.com/ui-router/images/icn_search_small.png'
            className={styles.icon}
          />
        }
      />
    </AutoComplete>
  )
})

InputAutoComplete.propTypes = {
    dataOptions: PropTypes.arrayOf(PropTypes.any),
    placeholder: PropTypes.string,
    onSelect: PropTypes.func,
}

InputAutoComplete.defaultProps = {
    dataOptions: [],
    placeholder: '',
    onSelect: () => {}
}

export default InputAutoComplete;