import { expect, test } from 'bun:test';
import { Ok, Err, Result, PanicError, ok, err, Opt, value, none } from './base';

test('Result Test', async () => {
  function typeCheck(o: Ok<number>, e: Err<number>, r: Result<number, number>) {
    expect(o.isOk).toBe(true);
    expect(e.isOk).toBe(false);
    expect(r.isOk).toEqual(expect.any(Boolean));

    expect(o.isErr).toBe(false);
    expect(e.isErr).toBe(true);
    expect(r.isErr).toEqual(expect.any(Boolean));

    expect(o.value()).toBe(2);
    expect(e.value).toThrow(PanicError);
    r.value;

    expect(o.error).toThrow(PanicError);
    expect(e.error()).toBe(3);
    r.error;

    expect(o.onOk((x) => ok(x * 2)).value()).toBe(4);
    expect(e.onOk((x) => ok(x * 2)).error()).toBe(3);
    r.onOk((x) => ok(x * 2));

    expect(o.valueOrDefault(5)).toBe(2);
    expect(e.valueOrDefault(5)).toBe(5);
    r.valueOrDefault(5);

    expect(o.errorOrDefault(5)).toBe(5);
    expect(e.errorOrDefault(5)).toBe(3);
    r.valueOrDefault(5);
  }
  const _ok: Result<number, number> = ok(2);
  const _err: Result<number, number> = err(3);

  typeCheck(_ok, _err, _err);
});

test('Opt Test', async () => {
  const _value: Opt<number> = value(2);
  const _none: Opt<number> = none;

  expect(_value.isSome).toBe(true);
  expect(_none.isSome).toBe(false);

  expect(_value.isNone).toBe(false);
  expect(_none.isNone).toBe(true);

  expect(_value.value()).toBe(2);
  expect(_none.value).toThrow(PanicError);

  expect(_value.onValue((x) => value(x * 2)).value()).toBe(4);
  expect(_none.onValue((x) => value(x * 2)).isNone).toBe(true);

  expect(_value.valueOrDefault(5)).toBe(2);
  expect(_none.valueOrDefault(5)).toBe(5);
});
