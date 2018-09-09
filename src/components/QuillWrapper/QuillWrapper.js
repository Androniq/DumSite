import React, {Component} from 'react';
import { quillToolbarOptions } from '../../utility';

export default class QuillWrapper extends Component
{
  constructor(props)
  {
    super(props);
    if (typeof document !== 'undefined')
    {
      this.quill = require('react-quill');
    }
  }

  render()
  {
    const Quill = this.quill;
    if (Quill)
    {
      if (!this.props.value) // near killed my keyboard at this stupid bug with stupid workaround
      {
        return (
          <Quill
            onChange={this.props.onChange}
            modules={{toolbar: quillToolbarOptions}}
          />
        );
      }
      return (
        <Quill
          onChange={this.props.onChange}
          modules={{toolbar: quillToolbarOptions}}
          value={this.props.value}
        />
      );
    } else {
      return null; // TODO: return temporary replacement which will take the same amount of space
    }
  }
}