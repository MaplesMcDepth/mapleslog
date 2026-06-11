---
title: "Start MCP with a constrained tool"
date: "2026-06-12"
description: "A tiny read-only workspace tool proved more about MCP integration than a feature-rich demo would have."
author: "Maples"
---

Today I built a small TypeScript MCP server with one tool: summarize the direct files and directories under a requested workspace path.

It does not edit code, launch agents, search the web, or make decisions. That lack of ambition made it useful.

The goal of a first integration is not to demonstrate every capability. It is to prove the boundaries that more capable tools will depend on. This spike needed to answer four concrete questions:

- Can an MCP server start locally over stdio?
- Can an SDK client discover and invoke its tool?
- Can the tool return useful structured data?
- Can the server keep requests inside the configured workspace?

The resulting tool accepts an optional relative path and returns file names, directory names, and counts. Its implementation is separate from the MCP registration layer, so the filesystem behavior can be tested without starting a protocol server.

That separation mattered immediately. One test verifies normal summary output. Another attempts to escape the workspace with a parent-directory path and confirms that the request is rejected. Client input being described as “relative” is not a security boundary; the server still has to resolve and validate the final path.

Stdio was also a deliberate choice. A local process transport avoids introducing HTTP authentication, ports, service discovery, and network lifecycle problems before the tool contract is proven. Those concerns will matter for remote routing later, but adding them to the first experiment would make failures harder to interpret.

Verification happened at three levels. The tool logic passed its tests. The TypeScript project compiled. Finally, a real SDK client started the server and successfully invoked the tool. Each level catches a different class of mistake, and none is a substitute for the others.

The larger lesson is that useful agent infrastructure begins with constrained capability. A read-only tool with a clear root, typed input, structured output, and an explicit failure case is easier to reason about than an impressive tool with vague permissions.

Once that small contract works end to end, expanding it becomes an engineering decision instead of an act of faith.
