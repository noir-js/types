// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import { base64urlToU8a, hexToU8a, isHex, isString, isU8a, u8aToBase64url, u8aToU8a } from '@pinot/util';
import { Raw } from '@polkadot/types';
import { AnyU8a, Registry } from '@polkadot/types-codec/types';

/* eslint-disable sort-keys */
const MULTICODEC = {
  secp256k1: new Uint8Array([0xe7, 0x01]),
  ed25519: new Uint8Array([0xed, 0x01]),
  sr25519: new Uint8Array([0xef, 0x01]),
  p256: new Uint8Array([0x80, 0x24]),
  blake2b_256: new Uint8Array([0xa0, 0xe4, 0x02, 0x20])
};
/* eslint-enable sort-keys */

function u8aStartsWith (v: Uint8Array, w: Uint8Array): boolean {
  if (v.length < w.length) {
    return false;
  }
  for (let i = 0; i < w.length; ++i) {
    if (v[i] !== w[i]) {
      return false;
    }
  }
  return true;
}

export class UniversalAddress extends Raw {
  constructor (registry: Registry, value?: AnyU8a) {
    let u8a;

    if (isU8a(value) || Array.isArray(value)) {
      u8a = u8aToU8a(value);
    } else if (!value) {
      u8a = new Uint8Array();
    } else if (isHex(value)) {
      u8a = hexToU8a(value);
    } else if (isString(value)) {
      if (value.at(0) !== 'u') {
        throw new Error('Unsupported format for UniversalAddress');
      }
      u8a = base64urlToU8a(value.substring(1));
    } else {
      throw new Error('Unsupported type for UniversalAddress');
    }

    if (u8a.length !== 0) {
      let valid = false;
      for (const alg of Object.values(MULTICODEC)) {
        if (u8aStartsWith(u8a, alg)) {
          valid = true;
          break;
        }
      }
      if (!valid) {
        throw new Error('Unknown algorithm for UniversalAddress');
      }
    }

    super(registry, u8a, u8a.length);
  }

  public override toHuman (): string {
    return this.toString();
  }

  public override toString (): string {
    return 'u' + u8aToBase64url(this.toU8a());
  }

  public override toRawType (): string {
    return 'UniversalAddress';
  }
}
