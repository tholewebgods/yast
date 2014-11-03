# Yast - Yet another survey tool

Evaluation, playground project to try implementing a one page application able survey. The reference frontend is implemented using BackboneJS, the trivial reference backend is implemented using a NodeJS server utilizing ExpressJs 4.

# Idea

- REST API for feedback and surveys
- Survey template as JSON datastructure
- Survey structure and text separated for easy internationalisation
- Simple Javascript library for frontends

# "Features"

- Multiple input element types (see below)
- Texts and survey structure separated
- Steps can depend on other answers values
- Humble responsiveness
- Dumb ExpressJs backend to serve and receive the survey

# Technology

## BackboneJs

- The template structure is fed into / as the view's config
- The `Step` view, extended from a `Group` maps the template `type` to the view class
- The survey values are stored into a model; the template's `id` will be the model's key.
- The pagination is controlled using a model: `navModel`

## Template

The template is based on JSON and consisting of a tree structure modeling the GUI elements and a list of translations.

A GUI element at least has this structure:
```
{type: "<TYPE>", content: <CONTENT>}
```

- `TYPE` can be `step`, `group`, `text`, `multiplechoice`, `range` or `freetext`
- `CONTENT` depends on the type and is an object for every type except `text`, which just contains the I18N reference
- `group` and `step` are similar, they only contain other elements
- `group`s may contain other groups
- All elements may have an `id` attribute specifying the key to store the value to

For an example template see `/data/form.json.example` and the corresponding `texts.json.example`.

### Types

#### Step

- `content` (Array) Contains other GUI template objects
- `depends` (String) Simple comparsion expression to match the value of another ID to a hardcoded value. This can be used to make a step dependent on another input element's choice/value. Currently only one comparsion level (`<IDENTIFYER> <COMPARATOR> <VALUE>`) is possible.

#### Group

- `content` (Array) contains other GUI template objects

#### Text

- `content` (String) I18N reference

#### Multiplechoice

- `id` (ID)
- `exclusive` (boolean) - If true only one option can be active at the time
- `layout` (String) - Control the layout of the buttons. Valid: `row`, `column`
- `choices` (Array) - Objects containing ...
-- `id` (ID)
-- `text` (String) I18N reference and optionally
-- `free-text` (boolean)

#### Range

- `id` (ID)
- `steps` (int) Number of options
- `lower` (String) I18N reference
- `upper` (String) I18N reference

#### Freetext

- `id` (ID)

# Try out

## Prepare the template

Copy the form and text JSON example files into a subdirectory with a numeric foldername which represents the ID.

```
$ mkdir /data/47
$ cp /data/form.json.example /data/47/form.json.example
$ cp /data/texts.json.example /data/47/texts.json.example
```

## Start the server

```
$ node server/runme.js
```

## Use it

Surf to on of the example pages, e.g.: http://localhost:7072/index.html#in-overlay,47

(The format of the hash part is `#{in-overlay|standalone},<ID>`.)

Send some surveys and take a look into the folder `/received/47`. You'll find some files with a Unix timestamp as name containing the result data in JSON format.

## See the results

The accumulated results can be examined under http://localhost:7072/results/47 too.

# Status

In early development. Unstable. Probably never done. Not tested. But working.

# License

This code is MIT licensed for you.
