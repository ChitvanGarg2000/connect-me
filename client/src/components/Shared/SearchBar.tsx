import React from 'react'
import { Input } from 'antd';
import "../styles/Search.css"

interface SearchBarProps {
    styles?: string;
    onSearch?: (value: string) => void
    placeholder: string
    onChange?: (targetValue: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ styles, onSearch, placeholder, onChange}) => {
  return (
    <Input.Search placeholder={placeholder} onSearch={onSearch} className={styles} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)} enterButton />
  )
}

export default SearchBar