# What is this?

**This is a Work in Progress** that I've posted here to collect feedback.
Nothing here is remotely production ready. It is entirely a proof of concept.

In an nutshell, I'm playing around with a format for describing Hypermedia APIs.  The goal is to identify
the relevant resources, relations and actions in the API.  In addition to identifying the relevant
resources, relationa and actions additional details are provided in the descriptions (via
JSON-Schema) of the "shape" of both resource data and action payloads.  From these descriptions, tools
can be created that generate various things like type definitions, diagrams, run-time validation and
domain specific client code.

If you have feedback, add it as an issue.

## Background

After some discussions at RestFest 2018 in Grand Rapids, I thought it would be
interesting to explore ways to specify hypermedia APIs.

It is first important to understand what I mean by hypermedia APIs. There are a
few properties that I tend to strive for in my APIs. The first is that they are
discoverable from a single entry point and you then navigate to different
resources via relations to different resources identified strictly by URLs.
Another is that I prefer APIs that have explicitly
declared actions on resources (ala
[Siren](https://github.com/kevinswiber/siren)). Furthermore, I want logic as
encapsulated on the server as possible and have the presence of resources,
relations and actions to indicate what is allowed by the client (in the context
of authentication, _etc._).

## Running

If you have Node and `yarn` installed, all you really need to do to play around with this
is run `yarn install` (to install all dependencies) and then run `yarn test`.
The tests are currently really slow (due to enormous snapshots in the tests).
But running the tests will generate output in a directly called
`./outputDirectory`. You can then play around with the contents of `sample.ts`
and rerun the tests (which will then start to fail, but you can ignore that) and
you'll get updated output in `./outputDirectory`.

## Rationale

There are many things that I think we could simultaneously achieve with such a
specification. Some of them are:

### Top Down Design

Sometimes it is nice to do top-down design of APIs. This doesn't mean giving
the APIs are discoverable. It just means that they aren't necessarily
completely organic in how they develop. By having a top down approach, some
amount of planning about resources, relations and actions can be done.

### Documentation

Even if you don't want to necessarily be constrained by top down design, it is
always nice to have a way of documenting what you've done. Even though
hypermedia APIs are discoverable, clients still need to understand the
"contract" of the API. This includes:

*   What types of resources am I likely to find?
*   What relations will that resource have to other resources?
*   What is the cardinality of those relations (0..1, 0.._, 1.._)?
*   What properties will a given resource have?
*   What actions will a given resource have?
*   What are the "arguments" to each action?

### Type Checking

Most of my work is in TypeScript because I like the assurances that TypeScript
can give me (statically) when working with a code base. By including the type
information in a profile about the properties of a resource or the arguments to
an action, I can automatically generate those type definitions for TypeScript
(or any other typed language, really). What is key here is that those type
definitions **can be shared by both the client and the server** and helps to
keep the two in sync.

### Runtime Validation

One "hole" in type checking is when data is serialized and deserialized. We've
turned it into bits and back and it is very hard to do any kind of static checks
in those cases. For that reason, it can be convenient whenever we deserialize
data to have a means at **runtime** to check to ensure that it conforms to the
type of data we are expecting. Normally, it would be tedious to have to
maintain both in language (_e.g.,_ TypeScript) type definitions as well as a
suitable run-time formulation of the same type (_e.g.,_ JSON Schema). But in
this approach, all type information is represented in JSON Schema (\*i.e., this
is the single source of truth) and type definitions are generated from that. In
this way, they are always in sync.

The presence (and synchronization) of the static and run-time type information
means that when we deserialize data, we can (if we choose to) perform a check to
ensure that the deserialized data conforms to the expected "shape". While a
production application may not want to take that hit all the time, such checks
could be done during testing to ensure that everything is conforming to the
"contract" implied by the specification.

However, for things like action
payloads or query strings, it is quite reasonable to perform such validations
everytime. For this reason, all schemas described in the profile are available
to both the client or server to support such runtime checking.

### Generated Client Navigation

I've created generic Siren navigation libraries. But with a high-level profile
of the API, it would be possible to generate domain specific navigation
libraries. Again, run-time validation is possible here to check that no
unexpected relations or properties appear. Furthermore, such generated
navigation code can also include the type definitions. This means that such
navigation code (in contrast to "generic" Siren client code) will have full
knowledge of the types of the data being worked with.

### Leaner Payloads

One of the issues with Siren (IMHO) is that responses include lots of redundant
information bout actions (argument types, media types, etc). In my experience,
this is static information for any real world project I've ever been involved
in. As such, it isn't really needed in the payload. To me, the main
information needed in the response from the server is simply whether that
particular affordance is available to the client. All other such information
could be moved to the profile.

If "leaner payloads" were the only reason for creating such profiles, it would
not be worth it given the ability to compress responses, etc. The main benefits
for a profile would be the ones listed above. But this is just a nice "extra"
that clients could take advantage of.

## Format

The format of the profile is probably most easily "read" in the form of
TypeScript type definitions. The basic ideal is that a profile specification
would be an instance of the `Profile` type defined in [`src/profile.ts`](https://github.com/xogeny/hyprofile/blob/master/src/profile.ts)

## Sample output

### Sample Profile

A simple profile can be found [here](https://github.com/xogeny/hyprofile/blob/master/sampleOutput/profile.json).

### Documentation

You can see a preview of generated documentation [here](https://htmlpreview.github.io/?https://github.com/xogeny/hyprofile/blob/master/sampleOutput/documentation.html).

For each resource that is documented, all resources that are one edge (relation
follow) away are also shown. At the end, all resources are combined in a single
diagram.

### Generated Types

The generated types associated with these resources, relations and actions can
be found
[here](https://github.com/xogeny/hyprofile/blob/master/sampleOutput/types.ts).
Note, they also appear inline in the documentation for reference.

### Resovled Schemas

In order to avoid any runtime confusion (_e.g.,_ having `$ref` changes out from
underneath you), all schemas are resolved at compile time and places in a single
file. For our sample profile, they are collected [here](https://github.com/xogeny/hyprofile/blob/master/sampleOutput/schemas.json).
