// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import { base64urlToU8a, compactAddLength, hexToU8a, isHex, isString, isU8a, u8aToBase64url, u8aToU8a } from '@pinot/util';
import { AnyU8a, Registry } from '@polkadot/types-codec/types';

import { Binary } from './Binary.js';

/* eslint-disable sort-keys */
export const ALGORITHMS = {
  ed25519: {
    len: 34,
    multicodec: Uint8Array.from([0xed, 0x01])
  },
  sr25519: {
    len: 34,
    multicodec: Uint8Array.from([0xef, 0x01])
  },
  secp256k1: {
    len: 35,
    multicodec: Uint8Array.from([0xe7, 0x01])
  },
  p256: {
    len: 35,
    multicodec: Uint8Array.from([0x80, 0x24])
  },
  blake2b_256: {
    len: 36,
    multicodec: Uint8Array.from([0xa0, 0xe4, 0x02, 0x20])
  }
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

export class UniversalAddress extends Binary {
  public static validate (value: AnyU8a): boolean {
    const u8a = u8aToU8a(value);

    if (u8a.length === 0) {
      return true;
    } else {
      for (const algo of Object.values(ALGORITHMS)) {
        if (u8aStartsWith(u8a, algo.multicodec)) {
          return u8a.length === algo.len;
        }
      }
    }
    return false;
  }

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
      u8a = compactAddLength(base64urlToU8a(value.substring(1)));
    } else {
      throw new Error('Unsupported type for UniversalAddress');
    }

    super(registry, u8a);

    if (!UniversalAddress.validate(this)) {
      throw new Error('Unknown algorithm for UniversalAddress');
    }
  }

  public override toHuman (): string {
    return this.toString();
  }

  public override toString (): string {
    return 'u' + u8aToBase64url(this.toU8a(true));
  }

  public override toRawType (): string {
    return 'UniversalAddress';
  }

  public get kind (): string {
    const u8a = this.toU8a(true);

    for (const [name, algo] of Object.entries(ALGORITHMS)) {
      if (u8aStartsWith(u8a, algo.multicodec)) {
        return name;
      }
    }

     return 'unknown';
  }
}
