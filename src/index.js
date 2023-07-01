import { getInput, notice } from "@actions/core"
import { exec } from "@actions/exec"
import * as child from "node:child_process";
import { join } from "node:path";

const runCommand = (command) => {
    return new Promise((resolve, reject) => {
        child.exec(command, (error, stdout) => {
            if (error) {
                reject({ message: error.message });
                return;
            }

            resolve(stdout);
        });
    });
};

const run = async () => {

    const imagesRepo = getInput("images-repo", { required: true });
    const region = getInput("region", { required: true });
    const workingDir = getInput("working-dir", { required: true });
    const tagName = getInput("tag-name", { required: true });
    const serviceRepositoryUri = getInput("service-repository-uri", { required: true });
    const serviceDockerFile = getInput("service-docker-file", { required: true });

    await runCommand(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${imagesRepo}`);

    // await exec(`aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${imagesRepo}`);

    notice("Authenticated with AWS ECR successfully.");

    const dockerFile = join(workingDir, serviceDockerFile);

    notice(`Building docker image ${serviceRepositoryUri} with tag ${tagName} from ${dockerFile} in ${workingDir}.`);

    await exec(`docker build --build-arg BUILD_ENV=prod -t ${serviceRepositoryUri}:${tagName} -f ${dockerFile} ${workingDir}`);

    notice(`Pushing docker image ${serviceRepositoryUri} with tag ${tagName} to ${imagesRepo}.`);

    await exec(`docker push ${serviceRepositoryUri}:${tagName}`);

    notice(`Pushed docker image ${serviceRepositoryUri} with tag ${tagName} successfully.`);
};

run();
