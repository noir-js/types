// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import type { AnyString, AnyU8a, Registry } from '@polkadot/types-codec/types';

import { base64urlToU8a, compactAddLength, hexToU8a, isHex, isString, isU8a, u8aToBase64url, u8aToU8a } from '@pinot/util';
import { Bytes } from '@polkadot/types';

export function decodeBinary (value?: AnyU8a | AnyString): Uint8Array {
  if (isU8a(value) || Array.isArray(value)) {
    return u8aToU8a(value);
  } else if (!value) {
    return new Uint8Array();
  } else if (isHex(value)) {
    return hexToU8a(value);
  } else if (isString(value)) {
    return compactAddLength(base64urlToU8a(value.toString()));
  }

  throw new Error(`Unknown type passed to binary decoder, found typeof ${typeof value}`);
}

export class Binary extends Bytes {
  constructor (registry: Registry, value?: AnyU8a) {
    super(registry, decodeBinary(value));
  }

  public override toHuman (): string {
    return u8aToBase64url(this.toU8a(true));
  }

  public override toRawType (): string {
    return 'Binary';
  }
}
