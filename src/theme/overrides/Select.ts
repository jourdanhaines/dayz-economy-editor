import { defineStyleConfig, theme } from "@chakra-ui/react";

const Select = defineStyleConfig({
    variants: {
        default: (props) => ({
            ...theme.components.Select.variants?.outline(props),
            "& option": {
                backgroundColor: "grey.600",
                color: "text.light",
            },
        }),
    },
    defaultProps: {
        variant: "default",
    },
});

export default Select;
