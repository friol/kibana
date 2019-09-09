/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { ChangeEvent, Component } from 'react';
import {
  EuiButton,
  EuiColorPicker,
  EuiFieldText,
  EuiFlexItem,
  EuiFormRow,
  EuiFilePicker,
  isValidHex,
} from '@elastic/eui';
import { InjectedIntl, injectI18n } from '@kbn/i18n/react';

import { get } from 'lodash';
import { encode } from '../../../../../../canvas/common/lib/dataurl';

import { MAX_SPACE_INITIALS } from '../../../../../common/constants';
import { Space } from '../../../../../common/model/space';
import { getSpaceColor, getSpaceInitials } from '../../../../../common/space_attributes';

interface Props {
  space: Partial<Space>;
  onChange: (space: Partial<Space>) => void;
  intl: InjectedIntl;
}

interface State {
  initialsHasFocus: boolean;
  pendingInitials?: string | null;
  avatarImage?: string | null;
}

class CustomizeSpaceAvatarUI extends Component<Props, State> {
  private initialsRef: HTMLInputElement | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      initialsHasFocus: false,
      avatarImage: props.space.avatarImage,
    };
  }

  private _handleChange = (avImg: string) => {
    this.setState({ avatarImage: avImg });

    if (avImg) {
      this.props.onChange({
        ...this.props.space,
        avatarImage: avImg,
      });
    }
  };

  private onFileUpload = (files: File[]) => {
    const [file] = files;
    const [type, subtype] = get(file, 'type', '').split('/');
    encode(file).then((dataurl: string) => this._handleChange(dataurl));
  };

  public render() {
    const { space, intl } = this.props;

    const { initialsHasFocus, pendingInitials } = this.state;

    const spaceColor = getSpaceColor(space);
    const isInvalidSpaceColor = !isValidHex(spaceColor) && spaceColor !== '';

    return (
      <form onSubmit={() => false}>
        <EuiFlexItem grow={false}>
          <EuiFormRow
            label={intl.formatMessage({
              id: 'xpack.spaces.management.customizeSpaceAvatar.initialItemsFormRowLabel',
              defaultMessage: 'Initials (2 max)',
            })}
          >
            <EuiFieldText
              inputRef={this.initialsInputRef}
              name="spaceInitials"
              // allows input to be cleared or otherwise invalidated while user is editing the initials,
              // without defaulting to the derived initials provided by `getSpaceInitials`
              value={initialsHasFocus ? pendingInitials || '' : getSpaceInitials(space)}
              onChange={this.onInitialsChange}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem grow={true}>
          <EuiFormRow
            label={intl.formatMessage({
              id: 'xpack.spaces.management.customizeSpaceAvatar.colorFormRowLabel',
              defaultMessage: 'Color',
            })}
            isInvalid={isInvalidSpaceColor}
          >
            <EuiColorPicker
              color={spaceColor}
              onChange={this.onColorChange}
              isInvalid={isInvalidSpaceColor}
            />
          </EuiFormRow>
          {this.filePickerOrImage()}
        </EuiFlexItem>
      </form>
    );
  }

  private removeAvatarImage() {
    this.setState({ avatarImage: '' });
    this.props.onChange({
      ...this.props.space,
      avatarImage: '',
    });
  }

  public filePickerOrImage() {
    const { intl } = this.props;
    const avImage = this.state.avatarImage;

    if (!this.state.avatarImage) {
      return (
        <EuiFormRow
          label={intl.formatMessage({
            id: 'xpack.spaces.management.customizeSpaceAvatar.avatarImage',
            defaultMessage: 'Pick an image for your space',
          })}
        >
          <EuiFilePicker
            compressed
            initialPromptText="Select avatar image"
            onChange={this.onFileUpload}
            accept="image/*"
          />
        </EuiFormRow>
      );
    } else {
      if (avImage) {
        return (
          <EuiButton color="danger" onClick={() => this.removeAvatarImage()}>
            Remove Avatar Image
          </EuiButton>
        );
      }
      return '';
    }
  }

  public initialsInputRef = (ref: HTMLInputElement) => {
    if (ref) {
      this.initialsRef = ref;
      this.initialsRef.addEventListener('focus', this.onInitialsFocus);
      this.initialsRef.addEventListener('blur', this.onInitialsBlur);
    } else {
      if (this.initialsRef) {
        this.initialsRef.removeEventListener('focus', this.onInitialsFocus);
        this.initialsRef.removeEventListener('blur', this.onInitialsBlur);
        this.initialsRef = null;
      }
    }
  };

  public onInitialsFocus = () => {
    this.setState({
      initialsHasFocus: true,
      pendingInitials: getSpaceInitials(this.props.space),
    });
  };

  public onInitialsBlur = () => {
    this.setState({
      initialsHasFocus: false,
      pendingInitials: null,
    });
  };

  public onInitialsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const initials = (e.target.value || '').substring(0, MAX_SPACE_INITIALS);

    this.setState({
      pendingInitials: initials,
    });

    this.props.onChange({
      ...this.props.space,
      initials,
    });
  };

  public onColorChange = (color: string) => {
    this.props.onChange({
      ...this.props.space,
      color,
    });
  };
}

export const CustomizeSpaceAvatar = injectI18n(CustomizeSpaceAvatarUI);
