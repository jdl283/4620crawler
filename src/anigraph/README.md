# AniGraph: An MVC Scene Graph

AniGraph is a combination of a [Model View Controller (MVC)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) framework and a [scene graph](https://en.wikipedia.org/wiki/Scene_graph) designed to make it easy for users to build, compose, and control customizable and procedural graphics for the web. It is written in [TypeScript]() using [ThreeJS]() and a bit of [React](). AniGraph applications can be built into static websites that are easy to deploy, making it especially useful for building quick shareable demos.

### Background:
Before we jump into AniGraph, let's go over some background information.

#### Model View Controller (MVC)
[Model-View-Controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller), or MVC, is often referred to as a "software architectural design pattern," which just means that it's a common way to design software... Most graphical user interfaces (GUIs) are built on some variation of MVC---so, if you are a comupter scientist in training and this is the first time you've heard the term, there is a good chance it won't be the last. While specific MVC patterns may vary from system to system, what they share is the basic philosophy that an application's core data (*Model*) should be separated from the code that is used to display (*View*) and interact with that data (*Controller*). This separation may already be familiar and expected in some cases; for example, one expects to see the same basic content when checking email in a phone application that they would see in a browser, even if the application has a different look and offers different controls.

AniGraph uses a variant of MVC idea is to separate software into three types of components: *Models*, which contain all of the software's basic data; *Views* which govern how that data is presented to the user; and *Controllers* which facilitate communication between models and views. `AniGraph` provides classes for building models, views, and controllers, which we'll be extending for this assignment.
