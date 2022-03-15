import { mode, darken, whiten } from "@chakra-ui/theme-tools";
export const ButtonStyles = {
  baseStyle: {},
  sizes: {},
  variants: {
    primary: (props: any) => ({
      bg: mode(darken("primary", 20), whiten("secondary", 20))(props),
      color: "white",
      _hover: {
        bg: mode(darken("primary", 20), whiten("secondary", 20))(props),
      },
    }),
  },
  defaultProps: {},
};
