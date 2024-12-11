import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tabs,
  Tab,
  Avatar,
} from "@nextui-org/react";

import { motion } from "framer-motion";

const Notifications = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onOpen: any;
  onClose: any;
}) => {
  const sizes = ["sm", "md", "lg"];

  return (
    <Modal
      backdrop="opaque"
      isOpen={isOpen}
      onClose={onClose}
      classNames={{
        base: "border border-border bg-body",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Notifications
            </ModalHeader>
            <ModalBody className="pb-6">
              <motion.div className="w-full">
                <Tabs fullWidth size={"md"} variant="solid" color="primary">
                  <Tab className="w-full" key="general" title="General">
                    <ul className="flex flex-col gap-6 mt-7">
                      {[1, 2, 3, 4].map((item) => (
                        <li>
                          <div className="flex flex-row gap-4">
                            <Avatar
                              src="https://cloud.appwrite.io/v1/storage/buckets/des-user-storage/files/674e6d9600177582d696/preview?width=2000&height=2000&gravity=top&quality=100&project=des&width=2000&height=2000&gravity=top&quality=100&project=des"
                              alt="yusa"
                              size="md"
                            />
                            <div>
                              <p className="text-[.9rem] text-white">
                                <strong className="font-semibold">Selçuk Bayraktar</strong> started
                                following you.
                              </p>
                              <p className="text-[.8rem] text-gray">1d ago</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </Tab>
                  <Tab className="w-full" key="comments" title="Comments" />
                  <Tab className="w-full" key="likes" title="Likes" />
                </Tabs>
              </motion.div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Notifications;
