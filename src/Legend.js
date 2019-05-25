import React from 'react';
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const ColoredCheckbox = withStyles({
  root: {
    color: props => props.customcolor,
    '&$checked': {
      color: props => props.customcolor,
    },
  },
  checked: {},
})(props => <Checkbox color="default" {...props} />);

const Legend = ({ fields, onChange }) => (
  <form>
    <Typography variant="h5" gutterBottom>
      Legenda
    </Typography>
    <FormGroup>
      {Object.entries(fields).map(([key, field]) => (
        <FormControlLabel
          key={key}
          control={
            <ColoredCheckbox
              checked={field.visible}
              onChange={event => onChange(key, event.target.checked)}
              value={key}
              customcolor={field.color}
            />
          }
          label={field.label}
        />
      ))}
    </FormGroup>
  </form>
);

export default Legend;
