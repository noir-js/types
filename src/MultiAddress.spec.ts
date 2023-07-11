// Copyright (C) 2023 Haderech Pte. Ltd.
// SPDX-License-Identifier: Apache-2.0

import { describe, expect, it } from 'vitest';

import { TypeRegistry } from '@polkadot/types';

import { MultiAddress } from './MultiAddress.js';
import { UniversalAddress } from './UniversalAddress.js';

describe('MultiAddress', (): void => {
  const registry = new TypeRegistry();

  registry.register({
    MultiAddress,
    'AccountId': UniversalAddress
  });

  const sr = 'u7wHUNZPHFf3THGEUGr0EqZ_WgiyFWIVMzeOaVoTnpW2ifQ';
  const k1 = 'u5wECOvHh76TR4a1cueOWfpjpAdr803xEzwv7bCFpl_XuUd8';
  const b2 = 'uoOQCIO_a-ocLu6rnJvG859XLBNZM4u32LX0JVG94-hpGvzOi';

  describe('decoding', (): void => {
    it('can decode a universal address', (): void => {
      const m0 = registry.createType<MultiAddress>('MultiAddress', sr);
      expect(m0.type).toEqual('Id');
      expect(m0.value.toHuman()).toEqual(sr);
      expect((m0.value as UniversalAddress).kind).toEqual('sr25519');

      const m1 = registry.createType<MultiAddress>('MultiAddress', k1);
      expect(m1.type).toEqual('Id');
      expect(m1.value.toHuman()).toEqual(k1);
      expect((m1.value as UniversalAddress).kind).toEqual('secp256k1');

      const m2 = registry.createType<MultiAddress>('MultiAddress', b2);
      expect(m2.type).toEqual('Id');
      expect(m2.value.toHuman()).toEqual(b2);
      expect((m2.value as UniversalAddress).kind).toEqual('blake2b_256');
    });
  });
});
