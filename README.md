# Usage
```bash
> npm run scanDir -- --dir ../kiwix-android/app/src/main
# OR
> node ./index.js --dir ../kiwix-android/app/src/main

> npm run serve
```


# Thoughts on logging

I currently use logging (commercially) primarily when I know there is an issue around a certain part of code / user interaction.
Most logs, even in production, don't stay in code for long. Just enough time to do the following:
* Verify the problem is in the specific area
* Understand the bug/error (Related inputs, outputs, variables)
* Verify the issue is fixed afterwards.
This isn't really a well thought out strategy, just a natural habit.
In personal projects, where user-counts are much lower, I track vague usage metrics (How often, and a general sense of what is being used).
Thinking about it, I can see that it might be useful to log the chain of specific user's actions.

I'm now going to do some reading on logging - how other people use it, and recommend using it.
I'll be writing as I read, so these will be live thoughts that follow.

* https://www.javacodegeeks.com/2011/01/10-tips-proper-application-logging.html
"Underestimating the value of good logs is a terrible mistake" - I fear I may be making this mistake...
Thought so far is that this guy cares more about / knows more about logging than I do - I'm curious.

"impressed by the nice graphs produced by this [Perf4j] simple utility." - Hadn't thought of 'Logs' being anything other than just bits of text

"you think hard which logging level is appropriate for this type of event" - something I proudly do make a big deal of. Mostly in JS there are only log, info, warn, error. This is something I find very useful for separating logs into different files & colours (using PM2)

"two major benefits over System.out., i.e. categories and levels" - I don't really use categories much. Only in HTTP logging I suppose with HTTP methods/endpoints.

Looking at the "table":
ERROR - I came to the same conclusion naturally, so we get emails/sms when something goes really bad
WARN - Don't really use as much as we should.
INFO - This seems to be very different to my typical logging system, of removing them when I'm not working on the area.
        Should definitely look more into this. I suppose it's helpful to know what's happened, incase a DB fails etc.
DEBUG - Don't tend to do this (in favor of TRACE)
TRACE - Most of my logging

"It is a much better idea to log, for example, only ids of domain objects (or even only size of the collection)" - good for multiple reasons I suppose, performance being only one

"few hundreds of MiB is probably the upper limit of how much you can log onto disk per hour." - Wow? Maybe I'm not logging enough...

"Each logging statement should contain both data and description" - key

"a log file should be readable, clean and descriptive. Don’t use magic numbers, log values, numbers, ids and include their context"

"Did I mention not to log passwords and any personal information? Don’t!" - important, I had to tell a colleague off for logging passwords... also for not hashing them :o

"If you follow the simple rule of logging each method input and output (arguments and return values)" - Hmmm, seems like this would be useful only on user-facing functions... I guess?

"No part of the system should stay with no logs at all."

"if you communicate with an external system, consider logging every piece of data that comes out from your application and gets in"

"avoid logging exceptions, let your framework or container" - depends on framework/container, but It makes sense that errors should be handled in a standard way (including presenting to the user)

"Computers will appreciate “ms after 1970 epoch” time format, while people would be delighted seeing “1 day 10 hours 17 minutes 36 seconds""


FIN
Very interesting...
I have now realised that there is much more that logging has to offer the team than I first thought... On the the next article...


* https://logback.qos.ch/manual/mdc.html

So far, what strikes me is that this method is mostly useful when the functions themselves don't contain the relevant context. This smells like very non-functional code to me. I'm surprised this kind of thing is needed in typical development

I found this article far less telling about logs in general, but still interesting to see how logging is done in different languages/contexts.

* https://futurestud.io/tutorials/retrofit-2-log-requests-and-responses

I'm starting to realise now that logging is, in a large way, a responsibility of framework/library maintainers. It's quite interesting reading about how different people implement logging.
The most important part seems to be making it easy for users (developers) of one's framework to have good logging.

"None
No logging.

Use this log level for production environments to enhance your apps performance by skipping any logging operation." - Slightly different tune... but I suppose this article is mostly about client side logging (Android devices), rather than production servers.

