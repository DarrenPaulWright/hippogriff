**hippogriff** • **Docs**

***

# Hippogriff

A zero-config test and benchmark runner.

CLI name is "hippogriff".

Docs
available [here.](https://github.com/DarrenPaulWright/hippogriff/blob/main/docs/README.md)

## Functions

### after()

```ts
function after(work: WorkCallback): void
```

Executes once after everything else within the same scope.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `work` | [`WorkCallback`](-internal-.md#workcallback) |

#### Returns

`void`

#### Defined in

[src/hippogriff.ts:294](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L294)

***

### afterEach()

```ts
function afterEach(work: WorkCallback): void
```

Executes immediately after each test or bench within the same scope and child scopes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `work` | [`WorkCallback`](-internal-.md#workcallback) |

#### Returns

`void`

#### Defined in

[src/hippogriff.ts:287](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L287)

***

### before()

```ts
function before(work: WorkCallback): void
```

Executes once before anything else within the same scope.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `work` | [`WorkCallback`](-internal-.md#workcallback) |

#### Returns

`void`

#### Defined in

[src/hippogriff.ts:273](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L273)

***

### beforeEach()

```ts
function beforeEach(work: WorkCallback): void
```

Executes immediately before each test or bench within the same scope and child scopes.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `work` | [`WorkCallback`](-internal-.md#workcallback) |

#### Returns

`void`

#### Defined in

[src/hippogriff.ts:280](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L280)

***

### bench()

```ts
function bench(
   title: string, 
   work?: WorkCallback, 
   settings?: ISettings): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `work`? | [`WorkCallback`](-internal-.md#workcallback) |
| `settings`? | [`ISettings`](-internal-.md#isettings) |

#### Returns

`void`

#### Defined in

[src/hippogriff.ts:171](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L171)

***

### describe()

```ts
function describe(
   title: string, 
   work?: WorkCallback, 
   settings?: ISettings): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `work`? | [`WorkCallback`](-internal-.md#workcallback) |
| `settings`? | [`ISettings`](-internal-.md#isettings) |

#### Returns

`void`

#### Defined in

[src/hippogriff.ts:116](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L116)

***

### it()

```ts
function it(
   title: string, 
   work?: WorkCallback, 
   settings?: ISettings): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `work`? | [`WorkCallback`](-internal-.md#workcallback) |
| `settings`? | [`ISettings`](-internal-.md#isettings) |

#### Returns

`void`

#### Defined in

[src/hippogriff.ts:214](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L214)

***

### when()

```ts
function when(
   title: string, 
   work?: WorkCallback, 
   settings?: ISettings): void
```

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `title` | `string` |
| `work`? | [`WorkCallback`](-internal-.md#workcallback) |
| `settings`? | [`ISettings`](-internal-.md#isettings) |

#### Returns

`void`

#### Defined in

[src/hippogriff.ts:167](https://github.com/DarrenPaulWright/hippogriff/blob/main/src/hippogriff.ts#L167)

## Modules

| Module | Description |
| ------ | ------ |
| [\<internal\>](-internal-.md) | - |

## Namespaces

| Namespace | Description |
| ------ | ------ |
| [assert](namespaces/assert.md) | Re-exported from type-enforcer. |
