**hippogriff**

***

# Hippogriff

A zero-config test and benchmark runner.

CLI name is "hippogriff".

Docs
available [here.](https://github.com/DarrenPaulWright/hippogriff/blob/main/docs/README.md)

## Modules

| Module | Description |
| ------ | ------ |
| [\<internal\>](-internal-.md) | - |

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [assert](hippogriff/namespaces/assert.md) | Re-exported from type-enforcer. |

## Variables

### bench

```ts
const bench: MainCallback;
```

Defined in: [src/hippogriff.ts:171](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L171)

***

### describe

```ts
const describe: MainCallback;
```

Defined in: [src/hippogriff.ts:116](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L116)

***

### it

```ts
const it: MainCallback;
```

Defined in: [src/hippogriff.ts:214](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L214)

***

### when

```ts
const when: MainCallback = describe;
```

Defined in: [src/hippogriff.ts:167](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L167)

## Functions

### after()

```ts
function after(work: WorkCallback): void;
```

Defined in: [src/hippogriff.ts:294](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L294)

Executes once after everything else within the same scope.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `work` | [`WorkCallback`](-internal-.md#workcallback) |

#### Returns

`void`

***

### afterEach()

```ts
function afterEach(work: WorkCallback): void;
```

Defined in: [src/hippogriff.ts:287](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L287)

Executes immediately after each test or bench within the same scope and child scopes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `work` | [`WorkCallback`](-internal-.md#workcallback) |

#### Returns

`void`

***

### before()

```ts
function before(work: WorkCallback): void;
```

Defined in: [src/hippogriff.ts:273](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L273)

Executes once before anything else within the same scope.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `work` | [`WorkCallback`](-internal-.md#workcallback) |

#### Returns

`void`

***

### beforeEach()

```ts
function beforeEach(work: WorkCallback): void;
```

Defined in: [src/hippogriff.ts:280](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L280)

Executes immediately before each test or bench within the same scope and child scopes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `work` | [`WorkCallback`](-internal-.md#workcallback) |

#### Returns

`void`
