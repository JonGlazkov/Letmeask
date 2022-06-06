import React, { useContext } from 'react';
import Switch from 'react-switch';
import { ThemeContext } from 'styled-components/';
import { shade } from 'polished'

import { Container } from './styles'

interface Props {
  toggleTheme(): void;
}


  const Header: React.FC<Props> = ({toggleTheme}) => {
  const { colors, title } = useContext(ThemeContext)
  
    return (
      <Container>
        <Switch
          onChange={toggleTheme}
          checked={title === 'light'}
          checkedIcon={false}
          uncheckedIcon={false}
          height={14}
          width={40}
          handleDiameter={15}
          offColor={shade(0.1, colors.secondary)}
          onColor={shade(0.1, colors.primary)}
        />
      </Container>
    );
}

export default Header;
