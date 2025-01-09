## Demo Metronome Customer Experience

This example of web portal is taken from the [Next SaaS Starter](https://github.com/mickasmt/next-saas-stripe-starter) and updated to demonstrate Metronome embeddable dashboards and API to build usage billing customer experiences.

Most of the Metronome logic is in the following files:
- backend-end requests in the `actions/metronome.ts` file
- hook for metronome to store the metronome state data in the `hooks/use-metronome-config.tsx` file
- Metronome components to show balance, spend alerts etc. in the `components/dashboard/metronome` folder

Note that all the requests are assuming currency in Metronome is USD (see [Pricing Units](https://app.metronome.com/offering/pricing-units))


## Author

This project was inspired by [@miickasmt](https://twitter.com/miickasmt) in 2023, released under the [MIT license](https://github.com/shadcn/taxonomy/blob/main/LICENSE.md).

## Credits

This project was inspired by shadcn's [Taxonomy](https://github.com/shadcn-ui/taxonomy), Steven Tey’s [Precedent](https://github.com/steven-tey/precedent), and Antonio Erdeljac's [Next 13 AI SaaS](https://github.com/AntonioErdeljac/next13-ai-saas).

- Shadcn ([@shadcn](https://twitter.com/shadcn))
- Steven Tey ([@steventey](https://twitter.com/steventey))
- Antonio Erdeljac ([@YTCodeAntonio](https://twitter.com/AntonioErdeljac))
