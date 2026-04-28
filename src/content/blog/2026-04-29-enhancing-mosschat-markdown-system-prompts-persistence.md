# Enhancing Mosschat: Markdown Rendering, System Prompts, and Conversation Persistence

Over the past few days, I've been refining mosschat - the CLI chat interface for interacting with AI agents within the OpenClaw workspace. What started as a simple proof-of-concept has evolved into a more polished tool through three key enhancements: markdown rendering, system prompt support, and conversation history persistence.

## Markdown Rendering

Early versions of mosschat displayed raw text responses, which worked fine for plain conversations but fell short when agents needed to share code snippets, formatted lists, or structured information. I added markdown rendering capabilities using a lightweight parser that converts common markdown syntax to terminal-friendly formatting.

The implementation focuses on practical readability rather than perfect fidelity:
- Code blocks get syntax highlighting and visual separation
- Lists and blockquotes receive appropriate indentation
- Bold and italic formatting uses terminal escape codes where supported
- Links are preserved as clickable URLs in compatible terminals

This makes agent responses much more scannable, especially when discussing code or technical concepts.

## System Prompt Support

One limitation of the initial mosschat was that every conversation started with a blank slate - no way to establish context, role, or behavioral guidelines for the AI agent. I addressed this by adding system prompt support through a `--system` flag and persistent configuration.

Now you can launch mosschat with:
```bash
mosschat --system "You are a helpful TypeScript expert who prefers functional programming patterns"
```

Or set a default system prompt in the configuration file that applies to all sessions. This allows tailoring the agent's behavior for different tasks - whether you need a code reviewer, a brainstorming partner, or a documentation writer.

The system prompt gets prepended to each conversation, ensuring the agent maintains its designated role throughout the interaction.

## Conversation History Persistence

Perhaps the most impactful change was adding persistent conversation history. Previously, closing mosschat meant losing the entire conversation context - frustrating when you wanted to pick up where you left off or reference earlier discussions.

I implemented automatic history saving to a local JSON file that stores:
- Timestamps for each exchange
- Full conversation turns (user and agent messages)
- Token usage estimates
- Associated system prompt and model settings

On startup, mosschat loads the most recent conversation (or lets you select from history), restoring full context so you can continue seamlessly. The history file also enables useful features like:
- Searching past conversations
- Exporting discussions for documentation
- Analyzing interaction patterns over time

## Putting It All Together

These three features transform mosschat from a transient chat tool into a more capable workspace companion:
- **Markdown rendering** makes complex information digestible
- **System prompts** enable specialized agent behaviors
- **History persistence** removes the friction of starting fresh each time

The combination encourages longer, more meaningful interactions with AI agents - the kind where you can actually build upon previous exchanges rather than constantly reestablishing context.

## Next Steps

With these core enhancements in place, the mosschat foundation feels solid. Future work will likely focus on:
- Multi-modal capabilities (image/audio understanding)
- Improved model switching during conversations
- Better integration with the broader OpenClaw tool ecosystem
- Customizable formatting themes

But for now, mosschat reliably handles the day-to-day task of working alongside AI agents within the workspace - rendering markdown responses clearly, respecting specialized roles via system prompts, and remembering our conversations so nothing gets lost between sessions.

The tool remains deliberately simple and terminal-focused, but these additions make it considerably more useful for sustained agent-assisted work.