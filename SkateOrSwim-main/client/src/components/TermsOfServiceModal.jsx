import React, { useState, useRef } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
    Box,
    Heading,
    VStack,
} from '@chakra-ui/react';

function TermsOfServiceModal({ isOpen, handleAcceptTerms }) {
    const [acceptEnabled, setAcceptEnabled] = useState(false);

    const handleScroll = (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
        const threshold = 10; // Pixels from the bottom to consider as "bottom reached"
        if (scrollTop + clientHeight + threshold >= scrollHeight) {
            setAcceptEnabled(true);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => { }} // Disable closing the modal
            size="xl"
            isCentered
            closeOnOverlayClick={false} // Prevent closing by clicking outside the modal
            closeOnEsc={false} // Prevent closing with the ESC key
            blockScrollOnMount={false}
        >
            <ModalOverlay />
            <ModalContent maxW={["90vw", "60vw"]} maxH={["80vh", "70vh"]}
            >
                <ModalHeader>Terms of Service for SkateOrSwim.com</ModalHeader>
                <ModalBody
                    onScroll={handleScroll}
                    overflowY="scroll"
                    maxHeight={"50vh"}
                >
                    <VStack spacing={4} align='stretch'>
                        <Text fontsize="md" textAlign={"center"} as="i" text>
                            (You must scroll to the bottom to accept the Terms of Service)
                        </Text>
                        {/* Last Updated */}
                        <Text as="i" fontSize="md" italic>
                            Last Updated: January 8th, 2024
                        </Text>

                        {/* Existing Section 1 */}
                        <Text fontSize="xl" fontWeight="bold">
                            1. Acceptance of Terms
                        </Text>
                        <Text fontSize="md">
                            By accessing and using SkateOrSwim.com (the "Website"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Website.
                        </Text>

                        {/* Existing Section 2 */}
                        <Text fontSize="xl" fontWeight="bold">
                            2. Description of Service
                        </Text>
                        <Text fontSize="md">
                            SkateOrSwim.com provides estimated ice thickness information and forecasts for various locations. These estimates are based on the Ashton method and are for informational purposes only.
                        </Text>

                        {/* New Section - Ice Thickness Estimates */}
                        <Text fontSize="xl" fontWeight="bold">
                            3. Ice Thickness Estimates
                        </Text>
                        <Text fontSize="md">
                            The ice thickness estimates provided on this Service are based on limited research and are to be used as a guide only. They are not definitive measurements and should not be relied upon as such. The estimates are generated without the benefit of on-site verification and thus, cannot account for local variations in ice strength or thickness, the presence of flowing water, or other environmental factors that can affect ice thickness, strength, or safety.
                        </Text>

                        {/* New Section - No Warranty */}
                        <Text fontSize="xl" fontWeight="bold">
                            4. No Warranty
                        </Text>
                        <Text fontSize="md">
                            The information provided by the Service is offered without warranty of any kind, express or implied. While we strive to update and keep the information accurate, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
                        </Text>

                        {/* New Section - Assumption of Risk */}
                        <Text fontSize="xl" fontWeight="bold">
                            5. Assumption of Risk
                        </Text>
                        <Text fontSize="md">
                            By using this Service, you acknowledge and agree that natural ice surfaces are inherently risky and that ice conditions vary constantly due to weather and other factors. It is your sole responsibility to personally verify the safety of any ice surface before stepping onto or bearing weight on the ice. The Service is not a substitute for personal judgment or local advice. Always consult with local authorities or experts on ice safety in your area before engaging in ice-related activities.
                        </Text>

                        {/* Existing Section 4 - Limitation of Liability */}
                        <Text fontSize="xl" fontWeight="bold">
                            6. Limitation of Liability
                        </Text>
                        <Text fontSize="md">
                            Under no circumstances will SkateOrSwim.com, its owner, affiliates, or agents be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of or inability to use the Website or any information provided on the Website.
                        </Text>

                        {/* New Section - Safety First */}
                        <Text fontSize="xl" fontWeight="bold">
                            7. Safety First
                        </Text>
                        <Text fontSize="md">
                            We urge all users to exercise caution and common sense when engaging in ice-related activities. Always bring appropriate safety gear and never use the ice alone.
                        </Text>

                        {/* New Section - Cookie Usage */}
                        <Text fontSize="xl" fontWeight="bold">
                            8. Cookie Usage
                        </Text>
                        <Text fontSize="md">
                            SkateOrSwim.com uses a minimal number of cookies to enhance user experience. By using the Website, you consent to the use of cookies.
                        </Text>

                        {/* Existing Section 6 - Changes to Terms */}
                        <Text fontSize="xl" fontWeight="bold">
                            9. Changes to Terms
                        </Text>
                        <Text fontSize="md">
                            We reserve the right to modify these Terms at any time. Your continued use of the Website following any changes indicates your acceptance of the new Terms.
                        </Text>

                        {/* Existing Section 7 - Governing Law */}
                        <Text fontSize="xl" fontWeight="bold">
                            10. Governing Law
                        </Text>
                        <Text fontSize="md">
                            These Terms are governed by the laws of the State of Maryland without regard to its conflict of law provisions.
                        </Text>

                        {/* Existing Contact Information */}
                        <Text fontSize="xl" fontWeight="bold">
                            11. Contact Information
                        </Text>
                        <Text fontSize="md">
                            If you have any questions about these Terms, please contact j.steinberg702@gmail.com.
                        </Text>

                        {/* Existing Acknowledgement */}
                        <Text fontSize="xl" fontWeight="bold">
                            12. Acknowledgement
                        </Text>
                        <Text fontSize="md">
                            By clicking "Accept" and/or using SkateOrSwim.com, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                        </Text>

                    </VStack>

                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        mr={3}
                        onClick={handleAcceptTerms}
                        isDisabled={!acceptEnabled}
                    >
                        Accept
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

export default TermsOfServiceModal;
