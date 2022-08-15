import {NextPage} from "next";
import {Button, Flex, Input, VStack} from "@chakra-ui/react";

const Animated: NextPage = () => {
    return (
        <Flex>
            <VStack spacing="4">
                <Input/>
                <Input/>
                <Button colorScheme="teal" w="full" type="submit">
                    ADD
                </Button>
                <Button colorScheme="red" w="full">
                    REMOVE
                </Button>
            </VStack>
        </Flex>
    );

}
export default Animated;